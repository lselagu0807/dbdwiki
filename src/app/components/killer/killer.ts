import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { KillerData } from '../../models/killer-model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-killer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './killer.html',
  styleUrls: ['./killer.css']
})
export class Killer {
  killers: KillerData[] = [];
  currentIndex = 0;
  selectedKiller: KillerData | null = null;
  killerPerks: any[] = [];
  isDetailView = false;
  isLoadingPerks = false;

  constructor(private dbdService: Service, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.dbdService.getKillers().subscribe({
      next: (res: any) => {
        // Asumiendo que la respuesta tiene el mismo formato que survivors
        this.killers = res.data || res;
        this.cd.detectChanges();
        console.log("Killers: ", this.killers);
      },
      error: (err) => console.log('F en el chat:', err)
    })
  }

  get visibleKillers() {
    if (!this.killers || this.killers.length === 0) return [];

    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.killers.length;
      if (idx < 0) idx += this.killers.length;

      if (this.killers[idx]) {
        result.push({
          data: this.killers[idx],
          position: i
        });
      }
    }
    return result;
  }

  rotate(direction: number) {
    if (this.isDetailView) return;
    this.currentIndex = (this.currentIndex + direction + this.killers.length) % this.killers.length;
  }

  openDetail(killer: KillerData) {
    console.log('Opening detail for:', killer);
    console.log('Killer code:', killer.code);

    this.selectedKiller = killer;
    this.isDetailView = true;
    this.isLoadingPerks = true;
    this.killerPerks = [];
    this.cd.detectChanges();

    // Cargar las perks del killer
    this.dbdService.getKillerPerksByCode(killer.code).subscribe({
      next: (perks) => {
        console.log('Perks received from API:', perks);
        this.killerPerks = perks;
        this.isLoadingPerks = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading perks:', err);
        this.isLoadingPerks = false;
        this.killerPerks = [];
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
}
