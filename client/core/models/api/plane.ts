import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ManifestPlane } from './manifest-plane';
import { Organization } from './organization';
import { TemplatePlane } from './template-plane';

export interface Plane {
  id: number;
  organizationId: number;
  capacity: number;
  name: string;

  organization: Organization;

  planeManifests: ManifestPlane[];
  planeTemplates: TemplatePlane[];
}

export const PlaneForm = (plane: Plane, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [plane.id],
    organizationId: [plane.organizationId, Validators.required],
    capacity: [plane.capacity, Validators.required],
    name: [plane.name, Validators.required]
  });
