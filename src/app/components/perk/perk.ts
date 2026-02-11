import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Perk } from '../../models/survivor-perks';
import { Service } from '../../services/service';

@Component({
  selector: 'app-perks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perk.html',
  styleUrls: ['./perk.css']
})
export class PerksComponent implements OnInit {
  allPerks: Perk[] = [];
  filteredPerks: Perk[] = [];
  selectedPerk: Perk | null = null;

  isDetailOpen = false;
  loading = true;
  searchTerm = '';

  // 🔑 CONFIGURACIÓN DE PAGINACIÓN
  currentPage = 1;
  itemsPerPage = 12; // Ajusta según el diseño de tu grid
  get totalPages(): number {
    return Math.ceil(this.filteredPerks.length / this.itemsPerPage);
  }

  constructor(private service: Service, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPerks();
  }

  loadPerks(): void {
    Promise.resolve().then(() => this.loading = true);
    this.service.getAllSurvivorPerks().subscribe({
      next: (perks: Perk[]) => {
        this.allPerks = perks;
        this.applyFilter(); // Usa el método centralizado
        Promise.resolve().then(() => {
          this.loading = false;
          this.cd.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error al cargar perks:', error);
        Promise.resolve().then(() => this.loading = false);
      }
    });
  }

  /**
   * Método centralizado para filtrar y resetear paginación
   */
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPerks = [...this.allPerks];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredPerks = this.allPerks.filter(perk =>
        perk.name.toLowerCase().includes(term) ||
        perk.description.toLowerCase().includes(term) ||
        perk.survivorName.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1; // Siempre resetear a página 1 al filtrar
  }

  filterPerks(): void {
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  // 🔑 MÉTODOS DE PAGINACIÓN
  getCurrentPagePerks(): Perk[] {
    if (this.filteredPerks.length === 0) return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPerks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Generar números de página con límite (máx 7 botones visibles)
  getPageNumbers(): number[] {
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, this.currentPage + half);

    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    if (this.currentPage <= half) {
      end = maxVisible;
    } else if (this.currentPage + half >= this.totalPages) {
      start = this.totalPages - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  viewPerkDetails(perk: Perk): void {
    this.selectedPerk = perk;
    this.isDetailOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePerkDetails(): void {
    this.isDetailOpen = false;
    this.selectedPerk = null;
    document.body.style.overflow = 'auto';
  }
}
