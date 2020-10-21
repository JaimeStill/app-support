import { Plane } from './plane';
import { Template } from './template';
import { TemplatePlanePerson } from './template-plane-person';

export interface TemplatePlane {
  id: number;
  planeId: number;
  templateId: number;

  plane: Plane;
  template: Template;

  templatePlanePeople: TemplatePlanePerson[];
}
