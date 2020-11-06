import { Route } from '@angular/router';
import { ManifestRoute } from './manifest.route';

export const ManifestRouteComponents = [
  ManifestRoute
]

export const ManifestRoutes: Route[] = [
  { path: 'manifest/:id', component: ManifestRoute }
]
