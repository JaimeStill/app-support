import { Component } from '@angular/core';

import {
  ConfirmDialog,
  Organization,
  OrganizationDialog,
  OrganizationService,
  OrganizationSource
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'organizations-route',
  templateUrl: 'organizations.route.html',
  providers: [ OrganizationService, OrganizationSource ]
})
export class OrganizationsRoute {
  constructor(
    private dialog: MatDialog,
    public orgSrc: OrganizationSource,
    public orgSvc: OrganizationService
  ) { }

  addOrganization = () => this.dialog.open(OrganizationDialog, {
    data: {} as Organization,
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.orgSrc.forceRefresh());

  editOrganization = (o: Organization) => this.dialog.open(OrganizationDialog, {
    data: Object.assign({} as Organization, o),
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.orgSrc.forceRefresh());

  removeOrganization = (o: Organization) => this.dialog.open(ConfirmDialog, {
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.orgSvc.removeOrganization(o);
      res && this.orgSrc.forceRefresh();
    }
  });
}
