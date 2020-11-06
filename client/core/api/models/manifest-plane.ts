import { Manifest } from './manifest';
import { ManifestPerson } from './manifest-person';
import { Plane } from './plane';

export interface ManifestPlane {
  id: number;
  manifestId: number;
  planeId: number;

  manifest: Manifest;
  plane: Plane;

  manifestPeople: ManifestPerson[];
}
