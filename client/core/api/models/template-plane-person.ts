import { Person } from './person';
import { TemplatePlane } from './template-plane';

export interface TemplatePlanePerson {
  id: number;
  personId: number;
  templatePlaneId: number;

  person: Person;
  templatePlane: TemplatePlane;
}
