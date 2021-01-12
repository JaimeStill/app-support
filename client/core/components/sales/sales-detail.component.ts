import {
  Component,
  Input
} from '@angular/core';

import { SalesDetail } from '../../models';

@Component({
  selector: 'sales-detail',
  templateUrl: 'sales-detail.component.html'
})
export class SalesDetailComponent {
  @Input() detail: SalesDetail;
}
