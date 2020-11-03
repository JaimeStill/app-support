import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Manifest } from './manifest';
import { Person } from './person';
import { Plane } from './plane';
import { Template } from './template';

export interface Organization {
  id: number;
  name: string;

  manifests: Manifest[];
  people: Person[];
  planes: Plane[];
  templates: Template[];
}

export const OrganizationForm = (org: Organization, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [org.id],
    name: [org.name, Validators.required]
  });
