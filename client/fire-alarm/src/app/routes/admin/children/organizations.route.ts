import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  Organization,
  OrganizationDialog,
  OrganizationService,
  OrganizationSource,
  SyncSocket
} from 'core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'organizations-route',
  templateUrl: 'organizations.route.html',
  providers: [ OrganizationService, OrganizationSource ]
})
export class OrganizationsRoute implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private sync: SyncSocket,
    public orgSrc: OrganizationSource,
    public orgSvc: OrganizationService
  ) { }

  ngOnInit() {
    this.sub = this.sync.organization$.subscribe(() => this.orgSrc.forceRefresh());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

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
