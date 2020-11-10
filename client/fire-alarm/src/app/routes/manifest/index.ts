import { Route } from '@angular/router';
import { ManifestsRoute } from './manifests.route';
import { ManifestRoute } from './manifest.route';
import { ViewManifestRoute } from './view-manifest.route';

import {
  ManifestsChildComponents,
  ManifestsChildRoutes
} from './children';

export const ManifestRouteComponents = [
  ...ManifestsChildComponents,
  ManifestsRoute,
  ManifestRoute,
  ViewManifestRoute
]

export const ManifestRoutes: Route[] = [
  { path: 'manifests', component: ManifestsRoute, children: ManifestsChildRoutes },
  { path: 'manifest/:id', component: ManifestRoute },
  { path: 'view-manifest/:id', component: ViewManifestRoute }
]
