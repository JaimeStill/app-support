import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Branch } from './branch';
import { Person } from './person';

export interface Rank {
  id: number;
  branchId: number;
  order: number;
  label: string;
  name: string;
  grade: string;

  branch: Branch;

  people: Person[];
}

export const RankForm = (rank: Rank, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [rank.id],
    branchId: [rank.branchId, Validators.required],
    order: [rank.order, Validators.required],
    label: [rank.label, Validators.required],
    name: [rank.name, Validators.required],
    grade: [rank.grade,
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(2)
    ]
  })
