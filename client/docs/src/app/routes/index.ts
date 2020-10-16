import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const RouteComponents = [
  HomeComponent
];

export const Routes: Route[] = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];
