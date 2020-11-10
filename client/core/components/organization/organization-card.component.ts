import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Organization } from '../../models';

@Component({
  selector: 'organization-card',
  templateUrl: 'organization-card.component.html'
})
export class OrganizationCardComponent {
  @Input() size = 360;
  @Input() organization: Organization;
  @Output() edit = new EventEmitter<Organization>();
  @Output() remove = new EventEmitter<Organization>();
}
