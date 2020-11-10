import { Route } from '@angular/router';
import { ManifestsClosedRoute } from './manifests-closed.route';
import { ManifestsOpenRoute } from './manifests-open.route';

export const ManifestsChildComponents = [
  ManifestsClosedRoute,
  ManifestsOpenRoute
];

export const ManifestsChildRoutes: Route[] = [
  { path: 'open', component: ManifestsOpenRoute },
  { path: 'closed', component: ManifestsClosedRoute },
  { path: '', redirectTo: 'open', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'open', pathMatch: 'prefix' }
]
