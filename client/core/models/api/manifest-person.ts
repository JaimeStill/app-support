import { ManifestPlane } from './manifest-plane';
import { Organization } from './organization';
import { Person } from './person';
import { Rank } from './rank';

export interface ManifestPerson {
  id: number;
  manifestPlaneId: number;
  organizationId: number;
  personId: number;
  rankId: number;
  travelerId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  nickname: string;
  occupation: string;
  title: string;

  manifestPlane: ManifestPlane;
  organization: Organization;
  person: Person;
  rank: Rank;
  traveler: Person;
}
