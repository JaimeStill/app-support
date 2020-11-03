import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Template } from '../../models';
import { PlaneService } from '../../services';

@Component({
  selector: 'template-card',
  templateUrl: 'template-card.component.html',
  providers: [PlaneService]
})
export class TemplateCardComponent implements OnInit {
  @Input() size = 380;
  @Input() template: Template;
  @Output() edit = new EventEmitter<Template>();
  @Output() remove = new EventEmitter<Template>();

  constructor(
    public planeSvc: PlaneService
  ) { }

  ngOnInit() {
    if (this.template?.id > 0) {
      this.planeSvc.getTemplatePlanes(this.template.id);
    }
  }
}
