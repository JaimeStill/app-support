import { Component } from '@angular/core';

import {
  Customer,
  CustomerService,
  QueryService
} from 'core';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  loading = false;
  importing = false;
  customers: Customer[];

  constructor(
    public customerSvc: CustomerService,
    public querySvc: QueryService
  ) { }

  importCustomers = async () => {
    this.importing = this.loading = true;

    const query = await this.querySvc.getQuery('import-customers');
    const customers = query && await this.querySvc.executeTypedQuery<Customer>(query);
    customers && await this.customerSvc.importCustomers(customers);

    this.importing = this.loading = false;
  }

  importCustomer = async (c: Customer) => await this.customerSvc.importCustomer(c);

  importSalesCustomers = async () => {
    this.importing = this.loading = true;

    const query = await this.querySvc.getQuery('import-sales-customers');
    const customers = query && await this.querySvc.executeTypedQuery<Customer>(query);
    customers && await this.customerSvc.importCustomers(customers);

    this.importing = this.loading = false;
  }

  searchCustomers = async (search: string) => {
    this.loading = true;
    const query = await this.querySvc.getQuery('search-customers');
    this.customers = query && await this.querySvc.executeTypedQueryWithProps<Customer>(query, `search:${search}`);
    this.loading = false;
  }

  clearCustomers = () => this.customers = null;
}
