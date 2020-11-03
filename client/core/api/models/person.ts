import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ManifestPlanePerson } from './manifest-plane-person';
import { Organization } from './organization';
import { Rank } from './rank';
import { TemplatePlanePerson } from './template-plane-person';

export interface Person {
  id: number;
  organizationId: number;
  rankId: number;
  dodId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  nickname: string;
  occupation: string;
  ssn: string;
  title: string;

  organization: Organization;
  rank: Rank;

  personManifestPlanes: ManifestPlanePerson[];
  personTemplatePlanes: TemplatePlanePerson[];
}

export const PersonForm = (person: Person, fb: FormBuilder, ssnPattern: RegExp): FormGroup =>
  fb.group({
    id: [person.id],
    organizationId: [person.organizationId, Validators.required],
    rankId: [person.rankId, Validators.required],
    dodId: [person.dodId, [
      Validators.required,
      Validators.pattern(/^\d{10}$/g)
    ]],
    firstName: [person.firstName, Validators.required],
    lastName: [person.lastName, Validators.required],
    middleName: [person.middleName],
    nickname: [person.nickname, Validators.required],
    occupation: [person.occupation, Validators.required],
    ssn: [person.ssn, [
      Validators.required,
      Validators.pattern(ssnPattern)
    ]],
    title: [person.title, Validators.required]
  });
