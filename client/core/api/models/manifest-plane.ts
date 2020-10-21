import { Manifest } from './manifest';
import { ManifestPlanePerson } from './manifest-plane-person';
import { Plane } from './plane';

export interface ManifestPlane {
  id: number;
  manifestId: number;
  planeId: number;

  manifest: Manifest;
  plane: Plane;

  manifestPlanePeople: ManifestPlanePerson[];
}
