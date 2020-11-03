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
  Template
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
    @Inject(MAT_DIALOG_DATA) private template: Template,
    public tpSrc: TemplatePersonSource,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    if (this.template?.id > 0)
      this.tpSrc.setBaseUrl(this.template?.id);
    else
      this.dialogRef.close();
  }

  checkBlackout = (p: Person) => this.selected.find(person => person.id === p.id);

  addPerson = (p: Person) => this.selected.indexOf(p) === -1 && this.selected.push(p);

  removePerson = (p: Person) => {
    const index = this.selected.indexOf(p);
    index > -1 && this.selected.splice(index, 1);
  }
}
