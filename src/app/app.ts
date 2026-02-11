import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, LoaderComponent],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDisenio');
}
