import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  Plane,
  PlaneModel
} from '../../models';

@Component({
  selector: 'plane-card',
  templateUrl: 'plane-card.component.html'
})
export class PlaneCardComponent {
  @Input() size = 380;
  @Input() plane: Plane | PlaneModel;
  @Input() blackout = false;
  @Input() actionTip = 'Action';
  @Input() actionColor = 'default';
  @Input() actionIcon = 'keyboard_arrow_right';
  @Output() action = new EventEmitter<Plane | PlaneModel>();
}
