import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Person } from '../../models';

@Component({
  selector: 'manifest-person',
  templateUrl: 'manifest-person.component.html'
})
export class ManifestPersonComponent {
  @Input() size = 420;
  @Input() person: Person;
  @Input() blackout = false;
  @Input() actionTip = 'Action';
  @Input() actionColor = 'default';
  @Input() actionIcon = 'keyboard_arrow_right';
  @Output() action = new EventEmitter<Person>();
}
