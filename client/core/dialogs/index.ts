import { BranchDialog } from './branch';
import { ConfirmDialog } from './confirm/confirm.dialog';

import {
  ManifestDialog,
  ManifestPeopleDialog,
  ManifestPlaneDialog,
  ManifestTransferDialog
} from './manifest';

import { OrganizationDialog } from './organization';
import { PersonDialog } from './person';
import { PlaneDialog } from './plane';
import { QueryDialog } from './query';
import { RankDialog } from './rank';

import {
  TemplateDialog,
  TemplatePeopleDialog,
  TemplatePlaneDialog,
  TemplateSelectDialog,
  TemplateTransferDialog
} from './template';

export const Dialogs = [
  BranchDialog,
  ConfirmDialog,
  ManifestDialog,
  ManifestPeopleDialog,
  ManifestPlaneDialog,
  ManifestTransferDialog,
  OrganizationDialog,
  PersonDialog,
  PlaneDialog,
  QueryDialog,
  RankDialog,
  TemplateDialog,
  TemplatePeopleDialog,
  TemplatePlaneDialog,
  TemplateSelectDialog,
  TemplateTransferDialog
];


export * from './branch';
export * from './confirm';
export * from './manifest';
export * from './organization';
export * from './person';
export * from './plane';
export * from './query';
export * from './rank';
export * from './template';
