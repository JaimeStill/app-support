import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  OrganizationService,
  SyncSocket
} from '../../services';

import { Subscription } from 'rxjs';
import { Organization } from '../../models';

@Component({
  selector: 'organization-dialog',
  templateUrl: 'organization.dialog.html',
  providers: [
    OrganizationService,
    SyncSocket
  ]
})
export class OrganizationDialog implements OnInit, OnDestroy {
  private sub: Subscription;
  update: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<OrganizationDialog>,
    private sync: SyncSocket,
    public orgSvc: OrganizationService,
    @Inject(MAT_DIALOG_DATA) public organization: Organization
  ) { }

  ngOnInit() {
    this.sub = this.sync.organization$.subscribe(async id => {
      if (id && id === this.organization?.id) {
        this.update = true;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  saveOrganization = async () => {
    const res = this.organization.id > 0
      ? await this.orgSvc.updateOrganization(this.organization)
      : await this.orgSvc.addOrganization(this.organization);

    res && this.dialogRef.close(true);
  }
}
