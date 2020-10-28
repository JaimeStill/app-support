import { Route } from '@angular/router';

import {
  AdminComponents,
  AdminRoutes
} from './admin';

import {
  HomeComponents,
  HomeRoutes
} from './home';

import {
  PersonRouteComponents,
  PersonRoutes
} from './person';

export const RouteComponents = [
  ...AdminComponents,
  ...HomeComponents,
  ...PersonRouteComponents
];

export const Routes: Route[] = [
  ...AdminRoutes,
  ...HomeRoutes,
  ...PersonRoutes,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
