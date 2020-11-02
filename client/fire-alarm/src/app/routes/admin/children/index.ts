import { Route } from '@angular/router';
import { OrganizationsRoute } from './organizations.route';
import { PeopleRoute} from './people.route';
import { PlanesRoute } from './planes.route';
import { RanksBranchesRoute } from './ranks-branches.route';

export const AdminChildComponents = [
  OrganizationsRoute,
  PeopleRoute,
  PlanesRoute,
  RanksBranchesRoute
];

export const AdminChildRoutes: Route[] = [
  { path: 'organizations', component: OrganizationsRoute },
  { path: 'people', component: PeopleRoute },
  { path: 'planes', component: PlanesRoute },
  { path: 'ranks-branches', component: RanksBranchesRoute },
  { path: '', redirectTo: 'organizations', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'organizations', pathMatch: 'prefix' }
]
