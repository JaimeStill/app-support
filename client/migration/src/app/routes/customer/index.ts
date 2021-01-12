import { Route } from '@angular/router';
import { CustomerRoute } from './customer.route';
import { CustomersRoute } from './customers.route';

export const CustomerRouteComponents = [
  CustomerRoute,
  CustomersRoute
]

export const CustomerRoutes: Route[] = [
  { path: 'customer/:id', component: CustomerRoute },
  { path: 'customers', component: CustomersRoute }
]
