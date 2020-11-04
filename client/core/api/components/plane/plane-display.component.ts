import {
  Component,
  Input
} from '@angular/core';

import { PlaneModel } from '../../models';

@Component({
  selector: 'plane-display',
  templateUrl: 'plane-display.component.html'
})
export class PlaneDisplayComponent {
  @Input() plane: PlaneModel
}
