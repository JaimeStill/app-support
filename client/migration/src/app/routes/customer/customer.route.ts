import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Customer,
  CustomerService,
  Query,
  QueryService,
  SalesOrder
} from 'core';

@Component({
  selector: 'customer-route',
  templateUrl: 'customer.route.html',
  providers: [ CustomerService, QueryService ]
})
export class CustomerRoute implements OnInit {
  customer: Customer;
  orders: SalesOrder[];

  constructor(
    private querySvc: QueryService,
    private route: ActivatedRoute,
    private router: Router,
    public customerSvc: CustomerService
  ) { }

  private navigate = () => this.router.navigate(['customers']);

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = Number.parseInt(params.get('id'));
      if (id) {
        this.customer = await this.customerSvc.getCustomer(id);

        if (this.customer) {
          const query = await this.querySvc.getQuery('customer-sales');
          this.orders = await this.querySvc.executeTypedQueryWithProps(query, `customerId:${this.customer.customerId}`);
        } else
        {
          this.navigate();
        }
      } else {
        this.navigate();
      }
    })
  }

  close = () => this.navigate();
}
