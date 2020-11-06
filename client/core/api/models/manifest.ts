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
