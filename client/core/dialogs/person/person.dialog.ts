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
  CoreService,
  OrganizationService,
  PersonService,
  RankService
} from '../../services';

import { MatSelectChange } from '@angular/material/select';

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
  saving = false;
  branchId: number;
  personForm: FormGroup;

  constructor(
    private coreSvc: CoreService,
    private dialogRef: MatDialogRef<PersonDialog>,
    private fb: FormBuilder,
    public branchSvc: BranchService,
    public orgSvc: OrganizationService,
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
    this.orgSvc.getOrganizations();
    this.branchSvc.getBranches();
  }

  initializeFormGroup = () =>
    this.personForm = PersonForm(this.person, this.fb, this.coreSvc.ssnPattern);

  selectBranch = (event: MatSelectChange) => {
    this.branchId = event.value;
    this.rankSvc.getRanks(this.branchId);
  }

  savePerson = async () => {
    if (!this.saving) {
      this.saving = true;

      const res = this.personForm?.value?.id > 0
        ? await this.personSvc.updatePerson(this.personForm.value)
        : await this.personSvc.addPerson(this.personForm.value);

      this.saving = false;
      res && this.dialogRef.close(true)
    }
  }
}
