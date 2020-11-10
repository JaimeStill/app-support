import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import { TemplateService } from '../../services';

import {
  PersonModel,
  PlaneModel
} from '../../models';

@Component({
  selector: 'template-transfer-dialog',
  templateUrl: 'template-transfer.dialog.html',
  providers: [TemplateService]
})
export class TemplateTransferDialog implements OnInit {
  saving = false;
  constructor(
    private dialogRef: MatDialogRef<TemplateTransferDialog>,
    public templateSvc: TemplateService,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonModel, templateId: number }
  ) { }

  ngOnInit() {
    if (this.data?.templateId > 0) {
      this.templateSvc.getTemplatePlanesWithSpace(this.data.templateId);
    } else {
      this.dialogRef.close();
    }
  }

  selectPlane = async (plane: PlaneModel) => {
    this.saving = true;
    const res = await this.templateSvc.updateTemplatePerson(this.data.person, plane);
    this.saving = false;
    res && this.dialogRef.close(true);
  }
}
