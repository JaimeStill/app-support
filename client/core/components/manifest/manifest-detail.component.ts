import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { ManifestService } from '../../services';
import { Manifest } from '../../models';

@Component({
  selector: 'manifest-detail',
  templateUrl: 'manifest-detail.component.html',
  providers: [ManifestService]
})
export class ManifestDetailComponent implements OnInit {
  @Input() manifest: Manifest;

  constructor(
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.manifest?.id > 0 && this.manifestSvc.getManifestPlanes(this.manifest.id);
  }
}
