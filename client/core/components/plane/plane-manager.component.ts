import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { PlaneModel } from '../../models';

@Component({
  selector: 'plane-manager',
  templateUrl: 'plane-manager.component.html',
  styleUrls: [ 'plane-manager.component.css' ]
})
export class PlaneManagerComponent {
  @Input() width = 560;
  @Input() height = 800;
  @Input() plane: PlaneModel;
  @Output() remove = new EventEmitter<PlaneModel>();
  @Output() add = new EventEmitter<PlaneModel>();
}
