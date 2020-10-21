import { ManifestPlane } from './manifest-plane';
import { Person } from './person';

export interface ManifestPlanePerson {
  id: number;
  manifestPlaneId: number;
  personId: number;
  branch: string;
  nickname: string;
  occupation: string;
  organization: string;
  rank: string;
  title: string;

  manifestPlane: ManifestPlane;
  person: Person;
}
