import { Route } from '@angular/router';

import {
  AdminComponents,
  AdminRoutes
} from './admin';

import {
  HomeComponents,
  HomeRoutes
} from './home';

export const RouteComponents = [
  ...AdminComponents,
  ...HomeComponents
];

export const Routes: Route[] = [
  ...AdminRoutes,
  ...HomeRoutes,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
