import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { TriggerService } from '../../../services';
import { TemplateService } from '../../services';
import { PersonModel } from '../../models';

@Component({
  selector: 'template-people',
  templateUrl: 'template-people.component.html',
  providers: [ TemplateService ]
})
export class TemplatePeopleComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @Input() size = 420;
  @Input() templatePlaneId: number;
  @Output() remove = new EventEmitter<PersonModel>();
  @Output() transfer = new EventEmitter<PersonModel>();

  constructor(
    public trigger: TriggerService,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    this.sub = this.trigger.templatePeople$.subscribe(id => {
      if (id && id === this.templatePlaneId)
        this.templateSvc.getTemplatePeople(this.templatePlaneId);
    });

    this.templatePlaneId && this.templateSvc.getTemplatePeople(this.templatePlaneId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
