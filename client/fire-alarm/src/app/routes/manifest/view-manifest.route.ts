import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Manifest,
  ManifestService,
  SyncSocket
} from 'core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'view-manifest-route',
  templateUrl: 'view-manifest.route.html',
  providers: [ManifestService]
})
export class ViewManifestRoute implements OnInit, OnDestroy {
  private sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sync: SyncSocket,
    public manifestSvc: ManifestService
  ) { }

  private navigate = () => this.router.navigate(['manifests']);

  private loadManifest = async (id: number) => {
    const res = await this.manifestSvc.getManifest(id);
    if (!res) this.navigate();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params) {
        if (params.has('id')) {
          const id = Number(params.get('id'));

          this.sub = this.sync
            .sync$
            .subscribe(res =>
              res && this.loadManifest(id)
            );

          this.loadManifest(id);
        } else
          this.navigate();
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateSpreadsheet = async (manifest: Manifest) =>
    await this.manifestSvc.createManifestSpreadsheet(manifest.id);
}
