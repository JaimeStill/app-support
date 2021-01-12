import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Customer } from '../../models';

@Component({
  selector: 'customer-card',
  templateUrl: 'customer-card.component.html'
})
export class CustomerCardComponent {
  migrated: boolean = null;
  @Input() customer: Customer;
  @Input() size = 400;
  @Input() actionLabel = 'Import';
  @Output() action = new EventEmitter<Customer>();
}
