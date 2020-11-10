import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Organization } from './organization';
import { TemplatePlane } from './template-plane';

export interface Template {
  id: number;
  organizationId: number;
  title: string;
  description: string;

  organization: Organization;

  templatePlanes: TemplatePlane[];
}

export const TemplateForm = (template: Template, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [template.id],
    organizationId: [template.organizationId, Validators.required],
    title: [template.title, Validators.required],
    description: [template.description]
  })
