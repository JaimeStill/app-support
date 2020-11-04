import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Plane } from '../../models';

@Component({
  selector: 'plane-admin-card',
  templateUrl: 'plane-admin-card.component.html',
  styleUrls: ['plane-admin-card.component.css']
})
export class PlaneAdminCardComponent {
  @Input() size = 420;
  @Input() plane: Plane;
  @Output() edit = new EventEmitter<Plane>();
  @Output() remove = new EventEmitter<Plane>();
}
