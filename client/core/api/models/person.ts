import { ManifestPlanePerson } from './manifest-plane-person';
import { Organization } from './organization';
import { Rank } from './rank';
import { TemplatePlanePerson } from './template-plane-person';

export interface Person {
  id: number;
  organizationId: number;
  rankId: number;
  dodId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  nickname: string;
  occupation: string;
  ssn: string;
  title: string;

  organization: Organization;
  rank: Rank;

  personManifestPlanes: ManifestPlanePerson[];
  personTemplatePlanes: TemplatePlanePerson[];
}
