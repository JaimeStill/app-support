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
  ManifestService,
  SyncSocket
} from '../../services';

import { Subscription } from 'rxjs';

@Component({
  selector: 'manifest-people',
  templateUrl: 'manifest-people.component.html',
  providers: [ ManifestService ]
})
export class ManifestPeopleComponent implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  @Input() size = 420;
  @Input() plane: PlaneModel;
  @Output() remove = new EventEmitter<PersonModel>();
  @Output() transfer = new EventEmitter<PersonModel>();

  constructor(
    private sync: SyncSocket,
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.sync.manifest$.subscribe(id => {
        if (id && id === this.plane?.parentId)
          this.manifestSvc.getManifestPeople(this.plane?.altId);
      }),
      this.sync
        .sync$
        .subscribe(res => res && this.manifestSvc.getManifestPeople(this.plane?.altId))
    )

    this.plane?.altId && this.manifestSvc.getManifestPeople(this.plane.altId);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
