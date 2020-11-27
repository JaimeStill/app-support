import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  ManifestService,
  ManifestSource,
  Manifest,
  OrganizationService,
  SyncSocket
} from 'core';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'manifests-closed-route',
  templateUrl: 'manifests-closed.route.html',
  providers: [ManifestService, ManifestSource]
})
export class ManifestsClosedRoute implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  constructor(
    private dialog: MatDialog,
    private manifestSvc: ManifestService,
    private orgSvc: OrganizationService,
    private router: Router,
    private sync: SyncSocket,
    public manifestSrc: ManifestSource
  ) { }

  ngOnInit() {
    this.subs.push(
      this.orgSvc
        .currentOrg$
        .subscribe(org =>
          org?.id > 0 &&
          this.manifestSrc.setBaseUrl(`queryClosedManifests/${org.id}`)
        ),
      this.sync
        .sync$
        .subscribe(res =>
          res && this.manifestSrc.forceRefresh()
        )
    )
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  viewManifest = (manifest: Manifest) => this.router.navigate(['view-manifest', manifest?.id]);

  toggleManifest = (manifest: Manifest) => this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Toggle Manifest',
      content: `Are you sure you want to re-open ${manifest?.title}?`
    },
    disableClose: true
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.manifestSvc.toggleManifestClosed(manifest);
      res && this.manifestSrc.forceRefresh();
    }
  })
}
