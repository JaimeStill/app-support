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
import { ManifestService } from '../../services';
import { PersonModel } from '../../models';

@Component({
  selector: 'manifest-people',
  templateUrl: 'manifest-people.component.html',
  providers: [ ManifestService ]
})
export class ManifestPeopleComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @Input() size = 420;
  @Input() manifestPlaneId: number;
  @Output() remove = new EventEmitter<PersonModel>();
  @Output() transfer = new EventEmitter<PersonModel>();

  constructor(
    private trigger: TriggerService,
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.sub = this.trigger.manifestPeople.subscribe(id => {
      if (id && id === this.manifestPlaneId)
        this.manifestSvc.getManifestPeople(this.manifestPlaneId);
    });

    this.manifestPlaneId && this.manifestSvc.getManifestPeople(this.manifestPlaneId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
