import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ManifestService } from 'core';

@Component({
  selector: 'view-manifest-route',
  templateUrl: 'view-manifest.route.html',
  providers: [ManifestService]
})
export class ViewManifestRoute implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
          this.loadManifest(id);
        } else
          this.navigate();
      }
    })
  }
}
