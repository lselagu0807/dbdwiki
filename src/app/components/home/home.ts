import { Component } from '@angular/core';
import { Service } from '../../services/service';
import { HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Survivor } from "../survivor/survivor";

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, Survivor],
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = window.scrollY;
    const gifVideo = document.getElementById('bg-video');
    const overlay = document.querySelector('.overlay') as HTMLElement;
    const reveals = document.querySelectorAll('.reveal');

    // 1. Desvanecer el GIF progresivamente
    if (gifVideo && overlay) {
      // El GIF se desvanece completamente al hacer scroll
      const gifOpacity = Math.max(0, 1 - scroll / 600);
      gifVideo.style.opacity = gifOpacity.toString();

      // El overlay se oscurece progresivamente
      const overlayOpacity = 0.6 + (scroll / 600);
      overlay.style.background = `rgba(0, 0, 0, ${Math.min(overlayOpacity, 1)})`;
    }

    // 2. Activar las casillas de información
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight - 150) {
        el.classList.add('active');
      }
    });
  }

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
        this.killers = res;
        console.log('killers cargados:', this.killers);
      },
      error: (err) => console.log('F en el chat:', err)
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
