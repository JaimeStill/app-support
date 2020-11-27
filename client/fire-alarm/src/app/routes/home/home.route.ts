import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Manifest,
  ManifestService,
  ManifestSource,
  OrganizationService,
  SyncSocket
} from 'core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'home-route',
  templateUrl: 'home.route.html',
  providers: [ManifestService, ManifestSource]
})
export class HomeRoute implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  constructor(
    private manifestSvc: ManifestService,
    private orgSvc: OrganizationService,
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
        .manifest$
        .subscribe(() =>
          this.manifestSrc.forceRefresh()
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

  generateSpreadsheet = async (manifest: Manifest) =>
    await this.manifestSvc.createManifestSpreadsheet(manifest.id);
}
