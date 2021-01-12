import {
  Injectable,
  Optional
} from '@angular/core';

import {
  ApiQueryService,
  SnackerService
} from '../../services';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../../config';
import { Customer } from '../../models';

@Injectable()
export class CustomerSource extends ApiQueryService<Customer> implements DataSource<Customer> {
  columns = [
    'title',
    'lastName',
    'firstName',
    'emailAddress',
    'phone'
  ];

  constructor(
    protected http: HttpClient,
    protected snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) {
    super(http, snacker);
    this.sort = {
      isDescending: false,
      propertyName: 'lastName'
    };

    this.baseUrl = `${this.config.api}customer/queryCustomers`;
  }

  trackCustomers = (customer: Customer) => customer.id;
}
