import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Service } from '../../services/service';
import { SurvivorModel } from '../../models/survivor-model';
import { LoadingService } from '../../services/loading';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-survivor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survivor.html',
  styleUrls: ['./survivor.css']
})
export class Survivor implements OnInit {
  survivors: SurvivorModel[] = [];
  currentIndex = 0;
  selectedSurvivor: SurvivorModel | null = null;
  survivorPerks: any[] = [];
  allPerks: any[] = [];
  isDetailView = false;
  isLoadingPerks = false;

  // Modal de perk individual
  selectedPerk: any = null;
  showPerkModal = false;
  isClosing = false;

  // Buscador  ← NUEVO
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

    this.dbdService.getSurvivors().subscribe({
      next: (res) => {
        this.survivors = res;
        this.cd.detectChanges();

        const requests = this.survivors.map((survivor: SurvivorModel) =>
          this.dbdService.getSurvivorPerksByCode(survivor.code).pipe(
            catchError(() => of([]))
          )
        );

        forkJoin(requests).subscribe({
          next: (allPerksArrays: any[]) => {
            this.allPerks = [];
            allPerksArrays.forEach((perks: any[], i: number) => {
              perks.forEach((p: any) => {
                this.allPerks.push({
                  ...p,
                  ownerName: this.survivors[i]?.name ?? ''
                });
              });
            });
            this.cd.detectChanges();
            this.loadingService.hide();
          },
          error: () => this.loadingService.hide()
        });
      },
      error: (err) => {
        console.error('Error al cargar survivors:', err);
        this.loadingService.hide();
      }
    });
  }

  // ── Buscador  ← NUEVO ────────────────────────────────

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

  get visibleSurvivors() {
    if (!this.survivors || this.survivors.length === 0) return [];
    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.survivors.length;
      if (idx < 0) idx += this.survivors.length;
      if (this.survivors[idx]) result.push({ data: this.survivors[idx], position: i });
    }
    return result;
  }

  rotate(direction: number) {
    if (this.isDetailView) return;
    this.currentIndex =
      (this.currentIndex + direction + this.survivors.length) % this.survivors.length;
  }

  openDetail(survivor: SurvivorModel) {
    this.selectedSurvivor = survivor;
    this.isDetailView = true;
    this.isLoadingPerks = true;
    this.survivorPerks = [];
    this.cd.detectChanges();

    this.dbdService.getSurvivorPerksByCode(survivor.code).subscribe({
      next: (perks) => {
        this.survivorPerks = perks;
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
      this.selectedSurvivor = null;
      this.survivorPerks = [];
      this.cd.detectChanges();
    }, 400);
  }

  // ── Modal perk ───────────────────────────────────────

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

  // ── Transform carrusel ───────────────────────────────

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