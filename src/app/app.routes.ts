import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Survivor } from './components/survivor/survivor';
import { Killer } from './components/killer/killer';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'survivors',
    component: Survivor
  },
  {
    path: 'killers',
    component: Killer
  }
];
