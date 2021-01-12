import { Route } from '@angular/router';

import {
  CustomerRouteComponents,
  CustomerRoutes
} from './customer';

import { HomeComponent } from './home/home.component';

export const RouteComponents = [
  ...CustomerRouteComponents,
  HomeComponent
];

export const Routes: Route[] = [
  ...CustomerRoutes,
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
