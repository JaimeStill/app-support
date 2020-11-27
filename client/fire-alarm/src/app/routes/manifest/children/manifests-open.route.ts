import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  ManifestDialog,
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
  selector: 'manifests-open-route',
  templateUrl: 'manifests-open.route.html',
  providers: [ManifestService, ManifestSource]
})
export class ManifestsOpenRoute implements OnInit, OnDestroy {
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
          this.manifestSrc.setBaseUrl(`queryOpenManifests/${org.id}`)
        ),
      this.sync
        .sync$
        .subscribe(res =>
          res && this.manifestSrc.forceRefresh()
        )
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  addManifest = () => this.dialog.open(ManifestDialog, {
    data: { } as Manifest,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.router.navigate(['manifest', res]));

  editManifest = (manifest: Manifest) => this.router.navigate(['manifest', manifest?.id]);

  viewManifest = (manifest: Manifest) => this.router.navigate(['view-manifest', manifest?.id]);

  toggleManifest = (manifest: Manifest) => this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Toggle Manifest',
      content: `Are you sure you want to close ${manifest?.title}?`
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

  removeManifest = (manifest: Manifest) => this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Remove Manifest',
      content: `Are you sure you want to remove ${manifest.title}?`
    },
    disableClose: true
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.manifestSvc.removeManifest(manifest);
      res && this.manifestSrc.forceRefresh();
    }
  })
}
