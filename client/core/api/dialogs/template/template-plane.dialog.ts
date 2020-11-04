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
  Template,
  Plane
} from '../../models';

import { TemplateService } from '../../services';

@Component({
  selector: 'template-plane-dialog',
  templateUrl: 'template-plane.dialog.html',
  providers: [ TemplateService ]
})
export class TemplatePlaneDialog {
  saving = false;
  selected = new Array<Plane>();

  constructor(
    private dialogRef: MatDialogRef<TemplatePlaneDialog>,
    @Inject(MAT_DIALOG_DATA) private template: Template,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    if (this.template?.id > 0)
      this.templateSvc.getAvailableTemplatePlanes(this.template.id, this.template.organizationId);
    else
      this.dialogRef.close();
  }

  checkBlackout = (p: Plane) => this.selected.find(plane => plane.id === p.id);

  addPlane = (p: Plane) => this.selected.indexOf(p) === -1 && this.selected.push(p);

  removePlane = (p: Plane) => {
    const index = this.selected.indexOf(p);
    index > -1 && this.selected.splice(index, 1);
  }

  savePlanes = async () => {
    this.saving = true;
    const res = await this.templateSvc.addTemplatePlanes(this.template.id, this.selected);
    res && this.dialogRef.close(true);
  }
}
