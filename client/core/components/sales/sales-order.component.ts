import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  Query,
  SalesDetail,
  SalesOrder
} from '../../models';

import { QueryService } from '../../services';

@Component({
  selector: 'sales-order',
  templateUrl: 'sales-order.component.html',
  providers: [QueryService]
})
export class SalesOrderComponent implements OnInit {
  details: SalesDetail[];
  @Input() expanded = true;
  @Input() order: SalesOrder;

  constructor(
    private querySvc: QueryService
  ) { }

  toggleExpanded = () => this.expanded = !this.expanded;

  async ngOnInit() {
    const query = await this.querySvc.getQuery('sales-details');
    this.details = await this.querySvc.executeTypedQueryWithProps(query, `salesOrderId:${this.order?.salesOrderId}`);
  }
}
