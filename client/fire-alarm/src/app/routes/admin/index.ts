import { Route } from '@angular/router';
import { AdminRoute } from './admin.route';

import {
  AdminChildComponents,
  AdminChildRoutes
} from './children';

export const AdminComponents = [
  ...AdminChildComponents,
  AdminRoute
];

export const AdminRoutes: Route[] = [
  { path: 'admin', component: AdminRoute, children: AdminChildRoutes }
]
