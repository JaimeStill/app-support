import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Template } from '../../models';
import { TemplateService } from '../../services';

@Component({
  selector: 'template-card',
  templateUrl: 'template-card.component.html',
  providers: [TemplateService]
})
export class TemplateCardComponent implements OnInit {
  @Input() size = 380;
  @Input() template: Template;
  @Output() edit = new EventEmitter<Template>();
  @Output() remove = new EventEmitter<Template>();
  @Output() generate = new EventEmitter<Template>();

  constructor(
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    if (this.template?.id > 0) {
      this.templateSvc.getTemplatePlanes(this.template.id);
    }
  }
}
