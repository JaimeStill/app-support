import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {
  Person,
  PlaneModel
} from '../../models';

import {
  ManifestPersonSource,
  ManifestService
} from '../../services'

@Component({
  selector: 'manifest-people-dialog',
  templateUrl: 'manifest-people.dialog.html',
  providers: [
    ManifestPersonSource,
    ManifestService
  ]
})
export class ManifestPeopleDialog implements OnInit {
  selected = new Array<Person>();

  constructor(
    private dialogRef: MatDialogRef<ManifestPeopleDialog>,
    @Inject(MAT_DIALOG_DATA) public plane: PlaneModel,
    public mpSrc: ManifestPersonSource,
    public manifestSvc: ManifestService
  ) { }

  ngOnInit() {
    if (this.plane?.parentId > 0)
      this.mpSrc.setBaseUrl(this.plane.parentId);
    else
      this.dialogRef.close();
  }

  checkBlackout = (p: Person) => this.selected.find(person => person.id === p.id);

  checkCapacity = () => this.selected.length + this.plane.reserved >= this.plane.capacity;

  addPerson = (p: Person) => this.selected.indexOf(p) === -1 && this.selected.push(p);

  removePerson = (p: Person) => {
    const index = this.selected.indexOf(p);
    index > -1 && this.selected.splice(index, 1);
  }

  savePeople = async () => {
    const res = await this.manifestSvc.addManifestPeople(this.plane.altId, this.selected);
    res && this.dialogRef.close(true);
  }
}
