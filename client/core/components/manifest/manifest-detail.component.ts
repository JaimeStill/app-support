import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
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
  @Output() generate = new EventEmitter<Manifest>();

  constructor(
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.manifest?.id > 0 && this.manifestSvc.getManifestPlanes(this.manifest.id);
  }
}
