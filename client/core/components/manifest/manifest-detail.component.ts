import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  ManifestService,
  SyncSocket
} from '../../services';

import { Subscription } from 'rxjs';
import { Manifest } from '../../models';

@Component({
  selector: 'manifest-detail',
  templateUrl: 'manifest-detail.component.html',
  providers: [ManifestService]
})
export class ManifestDetailComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  @Input() manifest: Manifest;
  @Output() generate = new EventEmitter<Manifest>();

  constructor(
    private sync: SyncSocket,
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.manifest?.id > 0 && this.manifestSvc.getManifestPlanes(this.manifest.id);

    this.sub = this.sync
      .sync$
      .subscribe(res => res && this.manifestSvc.getManifestPlanes(this.manifest.id));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
