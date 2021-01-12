import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  ConfirmDialog,
  Customer,
  CustomerService,
  CustomerSource
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'customers-route',
  templateUrl: 'customers.route.html',
  providers: [ CustomerService, CustomerSource ]
})
export class CustomersRoute {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    public customerSvc: CustomerService,
    public customerSrc: CustomerSource
  ) { }

  viewCustomer = (c: Customer) => this.router.navigate(['customer', c.id]);

  removeCustomer = (c: Customer) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Delete ${c.lastName}, ${c.firstName}?`,
      content: `Are you sure you want to delete ${c.lastName}, ${c.firstName}?`
    },
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.customerSvc.removeCustomer(c);
      res && this.customerSrc.forceRefresh();
    }
  })
}
