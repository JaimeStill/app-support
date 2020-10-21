import { Rank } from './rank';

export interface Branch {
  id: number;
  name: string;

  ranks: Rank[];
}
