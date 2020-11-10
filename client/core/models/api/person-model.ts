import { Organization } from './organization';
import { Rank } from './rank';

export interface PersonModel {
  id: number;
  altId: number;
  parentId: number;
  organizationId: number;
  rankId: number;
  travelerId: number;
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
}
