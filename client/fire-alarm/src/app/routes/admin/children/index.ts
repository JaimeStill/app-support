import { Route } from '@angular/router';
import { OrganizationsRoute } from './organizations.route';
import { PlanesRoute } from './planes.route';
import { RanksBranchesRoute } from './ranks-branches.route';

export const AdminChildComponents = [
  OrganizationsRoute,
  PlanesRoute,
  RanksBranchesRoute
];

export const AdminChildRoutes: Route[] = [
  { path: 'organizations', component: OrganizationsRoute },
  { path: 'planes', component: PlanesRoute },
  { path: 'ranks-branches', component: RanksBranchesRoute },
  { path: '', redirectTo: 'organizations', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'organizations', pathMatch: 'prefix' }
]
