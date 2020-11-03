import { BranchDialog } from './branch';
import { OrganizationDialog } from './organization';
import { PersonDialog } from './person';
import { PlaneDialog } from './plane';
import { RankDialog } from './rank';

import {
  TemplateDialog,
  TemplatePeopleDialog
} from './template';

export const ApiDialogs = [
  BranchDialog,
  OrganizationDialog,
  PersonDialog,
  PlaneDialog,
  RankDialog,
  TemplateDialog,
  TemplatePeopleDialog
]

export * from './branch';
export * from './organization';
export * from './person';
export * from './plane';
export * from './rank';
export * from './template';
