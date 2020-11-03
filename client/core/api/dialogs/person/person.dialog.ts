import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  Person,
  PersonForm
} from '../../models';

import {
  BranchService,
  OrganizationService,
  PersonService,
  RankService
} from '../../services';

import { MatSelectChange } from '@angular/material/select';
import { CoreService } from '../../../services';

@Component({
  selector: 'person-dialog',
  templateUrl: 'person.dialog.html',
  providers: [
    BranchService,
    CoreService,
    OrganizationService,
    PersonService,
    RankService
  ]
})
export class PersonDialog implements OnInit {
  branchId: number;
  personForm: FormGroup;

  constructor(
    private coreSvc: CoreService,
    private dialogRef: MatDialogRef<PersonDialog>,
    private fb: FormBuilder,
    public branchSvc: BranchService,
    public organizationSvc: OrganizationService,
    public personSvc: PersonService,
    public rankSvc: RankService,
    @Inject(MAT_DIALOG_DATA) public person: Person
  ) { }

  ngOnInit() {
    if (this.person?.rank?.branchId) {
      this.branchId = this.person.rank.branchId;
      this.rankSvc.getRanks(this.branchId);
    }

    this.initializeFormGroup();
    this.organizationSvc.getOrganizations();
    this.branchSvc.getBranches();
  }

  initializeFormGroup = () =>
    this.personForm = PersonForm(this.person, this.fb, this.coreSvc.ssnPattern);

  selectBranch = (event: MatSelectChange) => {
    this.branchId = event.value;
    this.rankSvc.getRanks(this.branchId);
  }

  savePerson = async () => {
    const res = this.personForm?.value?.id > 0
      ? await this.personSvc.updatePerson(this.personForm.value)
      : await this.personSvc.addPerson(this.personForm.value);

    res && this.dialogRef.close(true)
  }
}
