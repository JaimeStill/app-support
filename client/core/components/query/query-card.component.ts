import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Query } from '../../models';

@Component({
  selector: 'query-card',
  templateUrl: 'query-card.component.html'
})
export class QueryCardComponent {
  hovered = false;

  @Input() query: Query;
  @Input() size = 320;
  @Input() selected = false;
  @Output() download = new EventEmitter<Query>();
  @Output() edit = new EventEmitter<Query>();
  @Output() fork = new EventEmitter<Query>();
  @Output() remove = new EventEmitter<Query>();
  @Output() select = new EventEmitter<Query>();
}
