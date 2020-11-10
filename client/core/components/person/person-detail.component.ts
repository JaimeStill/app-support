import {
  Component,
  Input
} from '@angular/core';

import { PersonModel } from '../../models';

@Component({
  selector: 'person-detail',
  templateUrl: 'person-detail.component.html'
})
export class PersonDetailComponent {
  @Input() size = 380;
  @Input() person: PersonModel;
}
