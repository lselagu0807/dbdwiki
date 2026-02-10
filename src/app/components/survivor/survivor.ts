import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { SurvivorModel } from '../../models/survivor-model';
import { ChangeDetectorRef } from '@angular/core'; // 1. Importa esto

@Component({
  selector: 'app-survivor',
  standalone: true, // Estándar en Angular moderno
  imports: [CommonModule],
  templateUrl: './survivor.html',
  styleUrls: ['./survivor.css']
})
export class Survivor {
  survivors: SurvivorModel[] = []; // Tu array de datos aquí

  constructor(private dbdService: Service, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.dbdService.getSurvivors().subscribe({
      next: (res) => {
        this.survivors = res;
        this.cd.detectChanges();
        console.log("Survivors: ", this.survivors);
      },
      error: (err) => console.log('F en el chat:', err)
    })

  }

  currentIndex = 0; // El superviviente que está en el centro (rojo)

  // Obtenemos los 6 supervivientes que se verán (3 a la izquierda, el centro, 2 a la derecha)
  get visibleSurvivors() {
    if (!this.survivors || this.survivors.length === 0) return []; // Si no hay datos, devolvemos vacío

    const result = [];
    for (let i = -2; i <= 2; i++) {
      let idx = (this.currentIndex + i) % this.survivors.length;
      if (idx < 0) idx += this.survivors.length;

      // Verificamos que el superviviente existe antes de meterlo al carrusel
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
    this.currentIndex = (this.currentIndex + direction + this.survivors.length) % this.survivors.length;
  }

  // Cálculo de posición en la media circunferencia (arco de abajo)
  getTransform(position: number) {
    // Ajustamos el ángulo: 0 es el centro.
    // Los valores negativos van a la izquierda, positivos a la derecha.
    const angle = (position * 35); // Separación de 25 grados entre cada uno
    const radiusX = 250; // Ancho de la elipse
    const radiusY = 80;  // Profundidad de la curva hacia abajo

    // Convertir a radianes para Math.sin/cos
    const rad = (angle + 90) * (Math.PI / 180);

    const x = Math.cos(rad) * radiusX;
    const y = Math.sin(rad) * radiusY;

    // Escala: El del centro (0) es 1.2, los demás bajan hasta 0.6
    const scale = position === 0 ? 1.2 : 1 - Math.abs(position) * 0.15;
    const zIndex = 10 - Math.abs(position);

    return {
      'transform': `translate(${x}px, ${y}px) scale(${scale})`,
      'z-index': zIndex,
      'filter': position === 0 ? 'brightness(1.1) drop-shadow(0 0 10px red)' : 'brightness(0.6)'
    };
  }
}
