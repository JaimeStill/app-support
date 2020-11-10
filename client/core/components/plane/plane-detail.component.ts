import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { ManifestService } from '../../services';
import { PlaneModel } from '../../models';

@Component({
  selector: 'plane-detail',
  templateUrl: 'plane-detail.component.html',
  providers: [ManifestService]
})
export class PlaneDetailComponent implements OnInit {
  @Input() size = 520;
  @Input() plane: PlaneModel;

  constructor(
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    this.plane?.altId > 0 && this.manifestSvc.getManifestPeople(this.plane.altId);
  }
}
