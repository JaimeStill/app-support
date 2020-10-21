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
