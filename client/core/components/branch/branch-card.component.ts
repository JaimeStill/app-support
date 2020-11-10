import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Branch } from '../../models';

@Component({
  selector: 'branch-card',
  templateUrl: 'branch-card.component.html'
})
export class BranchCardComponent {
  @Input() size = 360;
  @Input() branch: Branch;
  @Input() selected = false;
  @Output() select = new EventEmitter<Branch>();
  @Output() edit = new EventEmitter<Branch>();
  @Output() remove = new EventEmitter<Branch>();
}
