import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  Plane,
  PlaneDialog,
  PlaneService,
  PlaneSource,
  SyncSocket
} from 'core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'planes-route',
  templateUrl: 'planes.route.html',
  providers: [PlaneService, PlaneSource]
})
export class PlanesRoute implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private sync: SyncSocket,
    public planeSrc: PlaneSource,
    public planeSvc: PlaneService
  ) { }

  ngOnInit() {
    this.sub = this.sync
      .sync$
      .subscribe(res => res && this.planeSrc.forceRefresh());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addPlane = () => this.dialog.open(PlaneDialog, {
    data: {} as Plane,
    disableClose: true,
    width: '600px'
  })
    .afterClosed()
    .subscribe(res => res && this.planeSrc.forceRefresh());

  editPlane = (p: Plane) => this.dialog.open(PlaneDialog, {
    data: Object.assign({} as Plane, p),
    disableClose: true,
    width: '600px'
  })
    .afterClosed()
    .subscribe(res => res && this.planeSrc.forceRefresh());

  removePlane = (p: Plane) => this.dialog.open(ConfirmDialog, {
    disableClose: true,
    autoFocus: false
  })
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.planeSvc.removePlane(p);
        res && this.planeSrc.forceRefresh();
      }
    });
}
