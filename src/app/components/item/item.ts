import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../services/service';
import { DbdItem } from '../../models/item-model';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item implements OnInit {
  items: DbdItem[] = [];
  selectedItem: DbdItem | null = null;
  itemAddons: any[] = [];

  isDetailView = false;
  isLoadingAddons = false;

  constructor(
    private dbdService: Service,
    private cd: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchItems();
    console.log("a");
  }

  fetchItems() {
    this.loadingService.show();
    this.dbdService.getItems().subscribe({
      next: (res: any) => {
        this.items = res.data || res;
        this.loadingService.hide();
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar items:', err);
        this.loadingService.hide();
      }
    });
  }

  openDetail(item: DbdItem) {
    this.selectedItem = item;
    this.isDetailView = true;
    this.isLoadingAddons = true;
    this.itemAddons = [];
    this.cd.detectChanges();

    // Llamamos al método que ya tienes en el Service para buscar addons
    this.dbdService.getAddonsByItemCode(item.type).subscribe({
      next: (addons) => {
        this.itemAddons = addons;
        this.isLoadingAddons = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading addons:', err);
        this.isLoadingAddons = false;
        this.cd.detectChanges();
      }
    });
  }

  closeDetail() {
    this.isDetailView = false;
    setTimeout(() => {
      this.selectedItem = null;
      this.itemAddons = [];
      this.cd.detectChanges();
    }, 400);
  }

  getRarityClass(rarity: string): string {
    if (!rarity) return 'common';
    return rarity.toLowerCase().replace(/\s+/g, '-');
  }
}
