import { Component } from '@angular/core';
import { Service } from '../../services/service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css']

})
export class Home {
  survivors: any[] = [];
  killers: any[] = [];
  perks_survis: any[] = [];
  perks_killer: any[] = [];
  addons: any[] = [];

  constructor(private dbdService: Service) { }

  ngOnInit() {
    this.dbdService.getSurvivors().subscribe({
      next: (res) => {
        this.survivors = res;
        console.log('survivors cargados:', this.survivors);
      },
      error: (err) => console.log('F en el chat:', err)
    });

    this.dbdService.getKillers().subscribe({
      next: (res) => {
        console.log('killers cargados: ', this.killers);
      }
    })

    this.dbdService.getSurvivorPerksByCode("dwightfairfield").subscribe({
      next: (res) => {
        this.perks_survis = res;
        console.log('perks survis cargadas:', this.perks_survis);
      },
      error: (err) => console.log('F en el chat:', err)
    });

    this.dbdService.getKillerPerksByCode("thetrapper").subscribe({
      next: (res) => {
        this.perks_killer = res;
        console.log('perks killers cargadas:', this.perks_killer);
      },
      error: (err) => console.log('F en el chat:', err)
    });

    this.dbdService.getAddonsByItemCode("flashlight").subscribe({
      next: (res) => {
        this.addons = res;
        console.log('addons cargados:', this.addons);
      },
      error: (err) => console.log('F en el chat:', err)
    });
  }

}
