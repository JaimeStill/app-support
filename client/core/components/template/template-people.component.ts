import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  PersonModel,
  PlaneModel
} from '../../models';

import {
  TemplateService,
  SyncSocket
} from '../../services';

import { Subscription } from 'rxjs';

@Component({
  selector: 'template-people',
  templateUrl: 'template-people.component.html',
  providers: [ TemplateService ]
})
export class TemplatePeopleComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @Input() size = 420;
  @Input() plane: PlaneModel;
  @Output() remove = new EventEmitter<PersonModel>();
  @Output() transfer = new EventEmitter<PersonModel>();

  constructor(
    private sync: SyncSocket,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    this.sub = this.sync.template$.subscribe(id => {
      if (id && id === this.plane?.parentId)
        this.templateSvc.getTemplatePeople(this.plane?.altId);
    });

    this.plane?.altId && this.templateSvc.getTemplatePeople(this.plane.altId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
