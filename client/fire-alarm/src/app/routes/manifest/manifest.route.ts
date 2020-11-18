import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ConfirmDialog,
  PersonModel,
  PlaneModel,
  Manifest,
  ManifestDialog,
  ManifestService,
  ManifestPeopleDialog,
  ManifestPlaneDialog,
  ManifestTransferDialog
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'manifest-route',
  templateUrl: 'manifest.route.html',
  providers: [ManifestService]
})
export class ManifestRoute implements OnInit {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public manifestSvc: ManifestService
  ) { }

  private navigate = () => this.router.navigate(['manifests']);

  private loadManifest = async (id: number) => {
    const res = await this.manifestSvc.getManifest(id);
    if (!res) this.navigate();
    this.manifestSvc.getManifestPlanes(id);
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

  editManifest = (manifest: Manifest) => this.dialog.open(ManifestDialog, {
    data: manifest,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.loadManifest(manifest.id));

  managePlanes = (manifest: Manifest) => this.dialog.open(ManifestPlaneDialog, {
    data: manifest,
    disableClose: true,
    width: '1200px',
    autoFocus: false
  })
  .afterClosed()
  .subscribe(res => res && this.manifestSvc.getManifestPlanes(manifest.id));

  addPeople = (p: PlaneModel) => this.dialog.open(ManifestPeopleDialog, {
    data: p,
    disableClose: true,
    width: '1200px',
    autoFocus: false
  })
  .afterClosed()
  .subscribe(res => res && this.manifestSvc.getManifestPlanes(p.parentId));

  removePlane = (p: PlaneModel) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Remove ${p.name}`,
      content: `Are you sure you want to remove ${p.name} (and all of its passengers) from the manifest?`
    },
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.manifestSvc.removeManifestPlane(p);
      res && this.manifestSvc.getManifestPlanes(p.parentId);
    }
  })

  removePerson = (p: PersonModel, m: Manifest) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Remove ${p.lastName}, ${p.firstName}`,
      content: `Are you sure you want to remove ${p.lastName}, ${p.firstName} from the plane?`
    },
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.manifestSvc.removeManifestPerson(m.id, p);
      res && this.manifestSvc.getManifestPlanes(m.id);
    }
  })

  transferPerson = (p: PersonModel, m: Manifest) => this.dialog.open(ManifestTransferDialog, {
    data: { person: p, manifestId: m.id } as { person: PersonModel, manifestId: number },
    disableClose: true,
    autoFocus: false,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.manifestSvc.getManifestPlanes(m.id));
}
