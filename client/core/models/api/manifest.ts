import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ManifestPlane } from './manifest-plane';
import { Organization } from './organization';

export interface Manifest{
  id: number;
  organizationId: number;
  title: string;
  description: string;
  dateCreated: Date;
  dateExpected: Date;
  dateExecuted: Date;
  isClosed: boolean;

  organization: Organization;

  manifestPlanes: ManifestPlane[];
}

export const ManifestForm = (manifest: Manifest, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [manifest.id],
    organizationId: [manifest.organizationId, Validators.required],
    title: [manifest.title, Validators.required],
    description: [manifest.description],
    dateCreated: [manifest.dateCreated],
    dateExpected: [manifest.dateExpected, Validators.required],
    dateExecuted: [manifest.dateExecuted],
    isClosed: [manifest.isClosed]
  })
