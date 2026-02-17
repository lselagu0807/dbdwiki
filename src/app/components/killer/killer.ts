import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Service } from '../../services/service';
import { LoadingService } from '../../services/loading';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-killer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './killer.html',
  styleUrls: ['./killer.css']
})
export class Killer implements OnInit {
  killers: any[] = [];
  currentIndex = 0;
  selectedKiller: any | null = null;
  killerPerks: any[] = [];
  allPerks: any[] = [];
  isDetailView = false;
  isLoadingPerks = false;

  // Modal de perk individual
  selectedPerk: any = null;
  showPerkModal = false;
  isClosing = false;

  // Buscador
  searchQuery = '';

  // Paginación
  currentPage = 1;
  readonly perksPerPage = 18;

  constructor(
    private dbdService: Service,
    private cd: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show();

    this.dbdService.getKillers().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.killers = data;
        this.cd.detectChanges();

        const requests = this.killers.map((killer: any) =>
          this.dbdService.getKillerPerksByCode(killer.code).pipe(
            catchError(() => of([]))
          )
        );

        forkJoin(requests).subscribe({
          next: (allPerksArrays: any[]) => {
            this.allPerks = [];
            allPerksArrays.forEach((perks: any[], i: number) => {
              perks.forEach((p: any) => {
                this.allPerks.push({ ...p, ownerName: this.killers[i]?.name ?? '' });
              });
            });
            this.cd.detectChanges();
            this.loadingService.hide();
          },
          error: () => this.loadingService.hide()
        });
      },
      error: (err) => {
        console.error('Error al cargar killers:', err);
        this.loadingService.hide();
      }
    });
  }

  // ── Buscador ─────────────────────────────────────────

  onSearch(query: string) {
    this.searchQuery = query.toLowerCase().trim();
    this.currentPage = 1;
    this.cd.detectChanges();
  }

  get filteredPerks(): any[] {
    if (!this.searchQuery) return this.allPerks;
    return this.allPerks.filter(p =>
      p.name?.toLowerCase().includes(this.searchQuery) ||
      p.description?.toLowerCase().includes(this.searchQuery) ||
      p.ownerName?.toLowerCase().includes(this.searchQuery)
    );
  }

  // ── Paginación ──────────────────────────────────────

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPerks.length / this.perksPerPage));
  }

  get pagedPerks(): any[] {
    const start = (this.currentPage - 1) * this.perksPerPage;
    return this.filteredPerks.slice(start, start + this.perksPerPage);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }
    return range;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    document.querySelector('.perks-catalog-container')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.cd.detectChanges();
  }

  // ── Carrusel ────────────────────────────────────────

  get visibleKillers() {
    if (!this.killers || this.killers.length === 0) return [];
    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.killers.length;
      if (idx < 0) idx += this.killers.length;
      if (this.killers[idx]) result.push({ data: this.killers[idx], position: i });
    }
    return result;
  }

  rotate(direction: number) {
    if (this.isDetailView) return;
    this.currentIndex =
      (this.currentIndex + direction + this.killers.length) % this.killers.length;
  }

  openDetail(killer: any) {
    this.selectedKiller = killer;
    this.isDetailView = true;
    this.isLoadingPerks = true;
    this.killerPerks = [];
    this.cd.detectChanges();

    this.dbdService.getKillerPerksByCode(killer.code).subscribe({
      next: (perks) => {
        this.killerPerks = perks;
        this.isLoadingPerks = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoadingPerks = false;
        this.cd.detectChanges();
      }
    });
  }

  closeDetail() {
    this.isDetailView = false;
    setTimeout(() => {
      this.selectedKiller = null;
      this.killerPerks = [];
      this.cd.detectChanges();
    }, 400);
  }

  openPerkModal(perk: any) {
    this.selectedPerk = perk;
    this.showPerkModal = true;
    this.isClosing = false;
    this.cd.detectChanges();
  }

  closePerkModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.showPerkModal = false;
      this.selectedPerk = null;
      this.cd.detectChanges();
    }, 300);
  }

  getTransform(position: number) {
    const angle = position * 35;
    const radiusX = 250;
    const radiusY = 80;
    const rad = (angle + 90) * (Math.PI / 180);
    const x = Math.cos(rad) * radiusX;
    const y = Math.sin(rad) * radiusY;
    const scale = position === 0 ? 1.2 : 1 - Math.abs(position) * 0.15;
    const zIndex = 10 - Math.abs(position);
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      'z-index': zIndex,
      filter: position === 0 ? 'brightness(1.1)' : 'brightness(0.4)'
    };
  }
}