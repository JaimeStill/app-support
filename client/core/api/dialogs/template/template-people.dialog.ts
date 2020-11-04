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
  TemplatePersonSource,
  TemplateService
} from '../../services';

@Component({
  selector: 'template-people-dialog',
  templateUrl: 'template-people.dialog.html',
  providers: [
    TemplatePersonSource,
    TemplateService
  ]
})
export class TemplatePeopleDialog implements OnInit {
  selected = new Array<Person>();

  constructor(
    private dialogRef: MatDialogRef<TemplatePeopleDialog>,
    @Inject(MAT_DIALOG_DATA) public plane: PlaneModel,
    public tpSrc: TemplatePersonSource,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    if (this.plane?.parentId > 0)
      this.tpSrc.setBaseUrl(this.plane.parentId);
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
    const res = await this.templateSvc.addTemplatePlanePeople(this.plane.altId, this.selected);
    res && this.dialogRef.close(true);
  }
}
