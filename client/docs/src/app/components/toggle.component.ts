import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'toggle',
  templateUrl: 'toggle.component.html'
})
export class ToggleComponent {
  @Input() color = 'primary';
  @Input() elevation = 'el2';
  @Input() activeTip = 'Collapse';
  @Input() activeIcon = 'keyboard_arrow_right';
  @Input() inactiveTip = 'Expand';
  @Input() inactiveIcon = 'keyboard_arrow_left';
  @Input() active: boolean;
  @Output() toggle = new EventEmitter();
}
