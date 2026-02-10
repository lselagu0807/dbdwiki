import { Component } from '@angular/core';
import { Service } from '../../services/service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html'
})
export class Home {
  personajes: any[] = [];

  constructor(private dbdService: Service) {}

  ngOnInit() {
    this.dbdService.getPersonajes().subscribe({
      next: (res) => {
        this.personajes = res;
        console.log('Personajes cargados:', this.personajes);
      },
      error: (err) => console.log('F en el chat:', err)
    });
  }

}
