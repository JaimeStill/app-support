import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';

import { Plane } from '../../models';

import {
  OrganizationService,
  PlaneService
} from '../../services';

import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'plane-dialog',
  templateUrl: 'plane.dialog.html',
  providers: [OrganizationService, PlaneService]
})
export class PlaneDialog implements OnInit {
  @Input() min = 0;
  @Input() max = 100;

  constructor(
    private dialogRef: MatDialogRef<PlaneDialog>,
    public orgSvc: OrganizationService,
    public planeSvc: PlaneService,
    @Inject(MAT_DIALOG_DATA) public plane: Plane
  )  { }

  ngOnInit() {
    this.orgSvc.getOrganizations();
  }

  savePlane = async () => {
    const res = this.plane.id > 0
      ? await this.planeSvc.updatePlane(this.plane)
      : await this.planeSvc.addPlane(this.plane);

    res && this.dialogRef.close(true);
  }

  updateCapacity = (event: MatSliderChange) => this.plane.capacity = event.value;
}
