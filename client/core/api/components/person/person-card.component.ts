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
  @Input() capacity = false;
  @Input() actionTip = 'Action';
  @Input() actionColor = 'default';
  @Input() actionIcon = 'keyboard_arrow_right';
  @Output() action = new EventEmitter<Person | PersonModel>();
}
