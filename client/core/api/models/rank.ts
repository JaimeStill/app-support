import { Branch } from './branch';
import { Person } from './person';

export interface Rank {
  id: number;
  branchId: number;
  order: number;
  label: string;
  name: string;
  grade: string;

  branch: Branch;

  people: Person[];
}
