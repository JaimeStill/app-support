import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { PersonSource } from '../../services';
import { Person } from '../../models';

@Component({
  selector: 'people-table',
  templateUrl: 'people-table.component.html'
})
export class PeopleTableComponent {
  @Input() personSrc: PersonSource;
  @Output() edit = new EventEmitter<Person>();
  @Output() remove = new EventEmitter<Person>();
}
