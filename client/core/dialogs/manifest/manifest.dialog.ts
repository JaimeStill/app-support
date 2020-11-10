import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  Manifest,
  ManifestForm
} from '../../models';

import {
  OrganizationService,
  ManifestService
} from '../../services';

@Component({
  selector: 'manifest-dialog',
  templateUrl: 'manifest.dialog.html',
  providers: [
    OrganizationService,
    ManifestService
  ]
})
export class ManifestDialog implements OnInit {
  manifestForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ManifestDialog>,
    private fb: FormBuilder,
    public orgSvc: OrganizationService,
    public manifestSvc: ManifestService,
    @Inject(MAT_DIALOG_DATA) public manifest: Manifest
  ) { }

  ngOnInit() {
    this.initializeFormGroup();
    this.orgSvc.getOrganizations();
  }

  initializeFormGroup = () =>
    this.manifestForm = ManifestForm(this.manifest, this.fb);

  saveManifest = async () => {
    const res = this.manifestForm?.value?.id > 0
      ? await this.manifestSvc.updateManifest(this.manifestForm.value)
      : await this.manifestSvc.addManifest(this.manifestForm.value);

    res && this.dialogRef.close(res);
  }
}
