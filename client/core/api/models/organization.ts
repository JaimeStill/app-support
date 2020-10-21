import { Manifest } from './manifest';
import { Person } from './person';
import { Plane } from './plane';
import { Template } from './template';

export interface Organization {
  id: number;
  name: string;

  manifests: Manifest[];
  people: Person[];
  planes: Plane[];
  templates: Template[];
}
