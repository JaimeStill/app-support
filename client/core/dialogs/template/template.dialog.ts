import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  Template,
  TemplateForm
} from '../../models';

import {
  OrganizationService,
  TemplateService
} from '../../services';

@Component({
  selector: 'template-dialog',
  templateUrl: 'template.dialog.html',
  providers: [
    OrganizationService,
    TemplateService
  ]
})
export class TemplateDialog implements OnInit {
  templateForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TemplateDialog>,
    private fb: FormBuilder,
    public orgSvc: OrganizationService,
    public templateSvc: TemplateService,
    @Inject(MAT_DIALOG_DATA) public template: Template
  ) { }

  ngOnInit() {
    this.initializeFormGroup();
    this.orgSvc.getOrganizations();
  }

  initializeFormGroup = () =>
    this.templateForm = TemplateForm(this.template, this.fb);

  saveTemplate = async () => {
    const res = this.templateForm?.value?.id > 0
      ? await this.templateSvc.updateTemplate(this.templateForm.value)
      : await this.templateSvc.addTemplate(this.templateForm.value);

    res && this.dialogRef.close(res);
  }
}
