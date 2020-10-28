import { Route } from '@angular/router';
import { PeopleRoute } from './people.route';

export const PersonRouteComponents = [
  PeopleRoute
]

export const PersonRoutes: Route[] = [
  { path: 'people', component: PeopleRoute }
]
