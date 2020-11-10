import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {
  Manifest,
  Plane
} from '../../models';

import { ManifestService } from '../../services';

@Component({
  selector: 'manifest-plane-dialog',
  templateUrl: 'manifest-plane.dialog.html',
  providers: [ManifestService]
})
export class ManifestPlaneDialog implements OnInit {
  saving = false;
  selected = new Array<Plane>();

  constructor(
    private dialogRef: MatDialogRef<ManifestPlaneDialog>,
    @Inject(MAT_DIALOG_DATA) private manifest: Manifest,
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    if (this.manifest?.id > 0)
      this.manifestSvc.getAvailableManifestPlanes(this.manifest.id, this.manifest.organizationId);
    else
      this.dialogRef.close();
  }

  checkBlackout = (p: Plane) => this.selected.find(plane => plane.id === p.id);

  addPlane = (p: Plane) => this.selected.indexOf(p) === -1 && this.selected.push(p);

  removePlane = (p: Plane) => {
    const index = this.selected.indexOf(p);
    index > -1 && this.selected.splice(index, 1);
  }

  savePlanes = async () => {
    this.saving = true;
    const res = await this.manifestSvc.addManifestPlanes(this.manifest.id, this.selected);
    this.saving = false;
    res && this.dialogRef.close(true);
  }
}
