import { LoadingService } from './../../services/loading';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { SurvivorModel } from '../../models/survivor-model';
import { ChangeDetectorRef } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-survivor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survivor.html',
  styleUrls: ['./survivor.css']
})
export class Survivor {
  survivors: SurvivorModel[] = [];
  currentIndex = 0;
  selectedSurvivor: SurvivorModel | null = null;
  survivorPerks: any[] = [];
  isDetailView = false;
  isLoadingPerks = false;

  constructor(private dbdService: Service, private cd: ChangeDetectorRef, private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.show(); // Aparece el loader (fondo opaco)

    this.dbdService.getSurvivors().subscribe({
      next: (res) => {
        this.survivors = res;
        this.cd.detectChanges();
        console.log("Survivors: ", this.survivors);
        this.loadingService.hide(); // Desaparece
      },
      error: (err) => {
        console.log('F en el chat:', err);
        this.loadingService.hide(); // Desaparece
      }
    })
  }

  get visibleSurvivors() {
    if (!this.survivors || this.survivors.length === 0) return [];

    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.survivors.length;
      if (idx < 0) idx += this.survivors.length;

      if (this.survivors[idx]) {
        result.push({
          data: this.survivors[idx],
          position: i
        });
      }
    }
    return result;
  }

  rotate(direction: number) {
    if (this.isDetailView) return;
    this.currentIndex = (this.currentIndex + direction + this.survivors.length) % this.survivors.length;
  }

  openDetail(survivor: SurvivorModel) {
    console.log('Opening detail for:', survivor);
    console.log('Survivor code:', survivor.code);

    this.selectedSurvivor = survivor;
    this.isDetailView = true;
    this.isLoadingPerks = true;
    this.survivorPerks = [];
    this.cd.detectChanges();

    // Cargar las perks del superviviente
    this.dbdService.getSurvivorPerksByCode(survivor.code).subscribe({
      next: (perks) => {
        console.log('Perks received from API:', perks);
        this.survivorPerks = perks;
        this.isLoadingPerks = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading perks:', err);
        this.isLoadingPerks = false;
        this.survivorPerks = [];
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
