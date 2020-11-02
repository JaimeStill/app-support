import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { Person } from '../../models';

@Component({
    selector: 'person-card',
    templateUrl: 'person-card.component.html'
})
export class PersonCardComponent {
    @Input() size = 360;
    @Input() person: Person;
    @Output() edit = new EventEmitter<Person>();
    @Output() remove = new EventEmitter<Person>();
}