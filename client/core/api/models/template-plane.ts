import { Plane } from './plane';
import { Template } from './template';
import { TemplatePerson } from './template-person';

export interface TemplatePlane {
  id: number;
  planeId: number;
  templateId: number;

  plane: Plane;
  template: Template;

  templatePeople: TemplatePerson[];
}
