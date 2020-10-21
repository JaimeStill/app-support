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
