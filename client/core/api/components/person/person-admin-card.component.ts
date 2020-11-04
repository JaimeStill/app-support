import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { Person } from '../../models';

@Component({
    selector: 'person-admin-card',
    templateUrl: 'person-admin-card.component.html'
})
export class PersonAdminCardComponent {
    @Input() size = 360;
    @Input() person: Person;
    @Output() edit = new EventEmitter<Person>();
    @Output() remove = new EventEmitter<Person>();
}
