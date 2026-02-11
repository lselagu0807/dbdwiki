import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class LoaderComponent implements OnInit {
  private loadingService = inject(LoadingService);

  // Signals para un estado reactivo y limpio
  isVisible = signal(true);
  isRendered = signal(true);
  isGlobalLoading = this.loadingService.isLoading; // Signal del servicio

  ngOnInit() {
    // Lógica de entrada inicial (2 segundos)
    setTimeout(() => {
      this.isVisible.set(false);
      setTimeout(() => this.isRendered.set(false), 800); // Tiempo del fade-out
    }, 2000);
  }
}
