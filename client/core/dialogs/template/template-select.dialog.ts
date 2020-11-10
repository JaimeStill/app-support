import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  ManifestService,
  TemplateService
} from '../../services';

import { Template } from '../../models';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'template-select-dialog',
  templateUrl: 'template-select.dialog.html',
  providers: [ ManifestService, TemplateService ]
})
export class TemplateSelectDialog implements OnInit {
  template: Template;

  constructor(
    private dialogRef: MatDialogRef<TemplateSelectDialog>,
    public manifestSvc: ManifestService,
    public templateSvc: TemplateService,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  ngOnInit() {
    if (this.id > 0) {
      this.templateSvc.getTemplates(this.id);
    } else {
      this.dialogRef.close();
    }
  }

  selectTemplate = (event: MatSelectChange) => this.template = event.value as Template;

  save = async () => {
    const res = await this.manifestSvc.generateManifest(this.template.id);
    res && this.dialogRef.close(res);
  }
}
