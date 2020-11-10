import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Rank } from '../../models';

@Component({
  selector: 'rank-card',
  templateUrl: 'rank-card.component.html'
})
export class RankCardComponent {
  @Input() size = 360;
  @Input() rank: Rank;
  @Output() edit = new EventEmitter<Rank>();
  @Output() remove = new EventEmitter<Rank>();
}
