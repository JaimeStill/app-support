import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Plane } from '../../models';

@Component({
  selector: 'plane-card',
  templateUrl: 'plane-card.component.html',
  styleUrls: ['plane-card.component.css']
})
export class PlaneCardComponent {
  @Input() size = 420;
  @Input() plane: Plane;
  @Output() edit = new EventEmitter<Plane>();
  @Output() remove = new EventEmitter<Plane>();
}
