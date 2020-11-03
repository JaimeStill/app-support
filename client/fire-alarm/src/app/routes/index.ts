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

import {
  TemplateRouteComponents,
  TemplateRoutes
} from './template';

export const RouteComponents = [
  ...AdminComponents,
  ...HomeComponents,
  ...PersonRouteComponents,
  ...TemplateRouteComponents
];

export const Routes: Route[] = [
  ...AdminRoutes,
  ...HomeRoutes,
  ...PersonRoutes,
  ...TemplateRoutes,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
