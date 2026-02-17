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
  styleUrls: ['./item.css'],
})
export class Item implements OnInit {
  items: DbdItem[] = [];
  currentIndex = 0;
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

  get visibleItems() {
    if (!this.items || this.items.length === 0) return [];

    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.items.length;
      if (idx < 0) idx += this.items.length;

      if (this.items[idx]) {
        result.push({
          data: this.items[idx],
          position: i
        });
      }
    }
    return result;
  }

  rotate(direction: number) {
    if (this.isDetailView) return;
    this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
  }

  openDetail(item: DbdItem) {
    this.selectedItem = item;
    this.isDetailView = true;
    this.isLoadingAddons = true;
    this.itemAddons = [];
    this.cd.detectChanges();

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

  getTransform(position: number) {
    const angle = (position * 35);
    const radiusX = 250;
    const radiusY = 80;

    const rad = (angle + 90) * (Math.PI / 180);
    const x = Math.cos(rad) * radiusX;
    const y = Math.sin(rad) * radiusY;

    const scale = position === 0 ? 1.2 : 1 - Math.abs(position) * 0.15;
    const zIndex = 10 - Math.abs(position);

    return {
      'transform': `translate(${x}px, ${y}px) scale(${scale})`,
      'z-index': zIndex,
      'filter': position === 0 ? 'brightness(1.1)' : 'brightness(0.4)'
    };
  }

  getRarityClass(rarity: string): string {
    if (!rarity) return 'common';
    return rarity.toLowerCase().replace(/\s+/g, '-');
  }
}