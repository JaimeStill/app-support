import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Folder } from '../models';

@Component({
  selector: 'sidemenu',
  templateUrl: 'sidemenu.component.html'
})
export class SidemenuComponent {
  @Input() folder: Folder;
  @Input() heading = 'Directory';

  @Input() navTip = 'Navigate Up';
  @Input() navDisabled: boolean;
  @Input() navIcon = 'subdirectory_arrow_left';
  @Output() navigate = new EventEmitter<Folder>();

  @Input() root = '/';
  @Input() homeTip = 'Home';
  @Input() homeDisabled: boolean;
  @Input() homeIcon = 'home';

  @Input() isLight = true;
  @Input() lightColor = 'accent';
  @Input() lightIcon = 'brightness_5';
  @Input() darkColor = 'default';
  @Input() darkIcon = 'brightness_3';
  @Output() theme = new EventEmitter();
}
