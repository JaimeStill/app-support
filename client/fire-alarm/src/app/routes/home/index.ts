import { Route } from '@angular/router';
import { HomeRoute } from './home.route';

export const HomeComponents = [
  HomeRoute
];

export const HomeRoutes: Route[] = [
  { path : 'home', component: HomeRoute }
]
