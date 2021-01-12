import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SnackerService } from '..';
import { ServerConfig } from '../../config';
import { Customer } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getCustomer = (id: number): Promise<Customer> => new Promise((resolve) => {
    this.http.get<Customer>(`${this.config.api}customer/getCustomer/${id}`)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  removeCustomer = (c: Customer): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}customer/removeCustomer`, c)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${c.lastName}, ${c.firstName} permanently removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })

  isMigrated = (customer: Customer): Promise<boolean> => new Promise((resolve) => {
    this.http.post<boolean>(`${this.config.api}customer/isMigrated`, customer)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  importCustomers = (customers: Customer[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}customer/importCustomers`, customers)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage('Customers successfully imported');
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })

  importCustomer = (customer: Customer): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}customer/importCustomer`, customer)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${customer.lastName}, ${customer.firstName} successfully imported`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })
}
