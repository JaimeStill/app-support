import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import { ManifestService } from '../../services';

import {
  PersonModel,
  PlaneModel
} from '../../models';

@Component({
  selector: 'manifest-transfer-dialog',
  templateUrl: 'manifest-transfer.dialog.html',
  providers: [ManifestService]
})
export class ManifestTransferDialog implements OnInit {
  saving = false;
  constructor(
    private dialogRef: MatDialogRef<ManifestTransferDialog>,
    public manifestSvc: ManifestService,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonModel, manifestId: number }
  ) { }

  ngOnInit() {
    if (this.data?.manifestId > 0) {
      this.manifestSvc.getAvailablePlanesWithSpace(this.data.manifestId, this.data.person.parentId);
    } else {
      this.dialogRef.close();
    }
  }

  selectPlane = async (plane: PlaneModel) => {
    this.saving = true;
    const res = await this.manifestSvc.updateManifestPerson(this.data.person, plane);
    this.saving = false;
    res && this.dialogRef.close(true);
  }
}
