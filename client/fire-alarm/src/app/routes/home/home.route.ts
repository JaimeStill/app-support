import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ManifestSource,
  OrganizationService
} from 'core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'home-route',
  templateUrl: 'home.route.html',
  providers: [ManifestSource]
})
export class HomeRoute implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    private orgSvc: OrganizationService,
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
}
