import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Person,
  PersonModel
} from '../../models';

@Component({
  selector: 'person-card',
  templateUrl: 'person-card.component.html'
})
export class PersonCardComponent {
  @Input() size = 420;
  @Input() person: Person | PersonModel;
  @Input() blackout = false;
}
