import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Rank } from './rank';

export interface Branch {
  id: number;
  name: string;

  ranks: Rank[];
}

export const BranchForm = (branch: Branch, fb: FormBuilder): FormGroup =>
  fb.group({
    id: [branch.id],
    name: [branch.name, Validators.required]
  });
