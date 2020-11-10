import { Person } from './person';
import { TemplatePlane } from './template-plane';

export interface TemplatePerson {
  id: number;
  personId: number;
  templatePlaneId: number;

  person: Person;
  templatePlane: TemplatePlane;
}
