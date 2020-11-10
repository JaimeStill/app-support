import { Route } from '@angular/router';
import { ManifestsRoute } from './manifests.route';
import { ManifestRoute } from './manifest.route';

import {
  ManifestsChildComponents,
  ManifestsChildRoutes
} from './children';

export const ManifestRouteComponents = [
  ...ManifestsChildComponents,
  ManifestsRoute,
  ManifestRoute
]

export const ManifestRoutes: Route[] = [
  { path: 'manifests', component: ManifestsRoute, children: ManifestsChildRoutes },
  { path: 'manifest/:id', component: ManifestRoute }
]
