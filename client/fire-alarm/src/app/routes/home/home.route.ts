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
  ServerConfig
} from 'core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home-route',
  templateUrl: 'home.route.html',
  providers: [ManifestService, ManifestSource]
})
export class HomeRoute implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    private config: ServerConfig,
    private manifestSvc: ManifestService,
    private orgSvc: OrganizationService,
    private router: Router,
    public manifestSrc: ManifestSource
  ) { }

  ngOnInit() {
    this.sub = this.orgSvc
      .currentOrg$
      .subscribe(org =>
        org?.id > 0 &&
        this.manifestSrc.setBaseUrl(`queryOpenManifests/${org.id}`)
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateSpreadsheet = async (manifest: Manifest) => {
    const res = await this.manifestSvc.createManifestSpreadsheet(manifest.id);
    if (res) {
      const path = `${this.config.server}${res.join('/')}`;
      console.log('Generate Manifest Spreadsheet Path', path);
      window.open(path, '_blank');
    }
  }

  generateStream = async (manifest: Manifest) => {
    const res = await this.manifestSvc.createManifestStream(manifest.id);

    if (res) {
      console.log('generateStream - blob', res);
    }
  }
}
