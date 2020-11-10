import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Manifest } from '../../models';
import { ManifestService } from '../../services';

@Component({
  selector: 'manifest-card',
  templateUrl: 'manifest-card.component.html',
  providers: [ManifestService]
})
export class ManifestCardComponent {
  @Input() size = 380;
  @Input() manifest: Manifest;
  @Input() canEdit = true;
  @Output() view = new EventEmitter<Manifest>();
  @Output() edit = new EventEmitter<Manifest>();
  @Output() toggle = new EventEmitter<Manifest>();
  @Output() remove = new EventEmitter<Manifest>();

  constructor(
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    if (this.manifest?.id > 0) {
      this.manifestSvc.getManifestPlanes(this.manifest.id);
    }
  }
}
