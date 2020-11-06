import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ManifestPerson } from './manifest-person';
import { Organization } from './organization';
import { Rank } from './rank';
import { TemplatePerson } from './template-person';

export interface Person {
  id: number;
  executiveId?: number;
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

  executive: Person;
  organization: Organization;
  rank: Rank;

  associates: Person[];
  personManifestPlanes: ManifestPerson[];
  personTemplatePlanes: TemplatePerson[];
  trips: ManifestPerson[];
}

export const PersonForm = (person: Person, fb: FormBuilder, ssnPattern: RegExp): FormGroup =>
  fb.group({
    id: [person.id],
    executiveId: [person.executiveId],
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
