import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject
} from '@angular/core';

import { Organization } from '../../models';
import { OrganizationService } from '../../services';

@Component({
  selector: 'organization-dialog',
  templateUrl: 'organization.dialog.html',
  providers: [OrganizationService]
})
export class OrganizationDialog {
  constructor(
    private dialogRef: MatDialogRef<OrganizationDialog>,
    public orgSvc: OrganizationService,
    @Inject(MAT_DIALOG_DATA) public organization: Organization
  ) { }

  saveOrganization = async () => {
    const res = this.organization.id > 0
      ? await this.orgSvc.updateOrganization(this.organization)
      : await this.orgSvc.addOrganization(this.organization);

    res && this.dialogRef.close(true);
  }
}
