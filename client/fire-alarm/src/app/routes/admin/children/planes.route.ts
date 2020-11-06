import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ConfirmDialog,
  Plane,
  PlaneDialog,
  PlaneService,
  PlaneSource
} from 'core';

@Component({
  selector: 'planes-route',
  templateUrl: 'planes.route.html',
  providers: [ PlaneService, PlaneSource ]
})
export class PlanesRoute {
  constructor(
    private dialog: MatDialog,
    public planeSrc: PlaneSource,
    public planeSvc: PlaneService
  ) { }

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
      if(result) {
        const res = await this.planeSvc.removePlane(p);
        res && this.planeSrc.forceRefresh();
      }
    });
  }
