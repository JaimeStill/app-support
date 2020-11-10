import { BranchDialog } from './branch';

import {
  ManifestPeopleDialog,
  ManifestPlaneDialog,
  ManifestTransferDialog
} from './manifest';

import { OrganizationDialog } from './organization';
import { PersonDialog } from './person';
import { PlaneDialog } from './plane';
import { RankDialog } from './rank';

import {
  TemplateDialog,
  TemplatePeopleDialog,
  TemplatePlaneDialog,
  TemplateSelectDialog,
  TemplateTransferDialog
} from './template';

export const ApiDialogs = [
  BranchDialog,
  ManifestPeopleDialog,
  ManifestPlaneDialog,
  ManifestTransferDialog,
  OrganizationDialog,
  PersonDialog,
  PlaneDialog,
  RankDialog,
  TemplateDialog,
  TemplatePeopleDialog,
  TemplatePlaneDialog,
  TemplateSelectDialog,
  TemplateTransferDialog
]

export * from './branch';
export * from './manifest';
export * from './organization';
export * from './person';
export * from './plane';
export * from './rank';
export * from './template';
