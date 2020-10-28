import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject
} from '@angular/core';

import { Branch } from '../../models';
import { BranchService } from '../../services';

@Component({
  selector: 'branch-dialog',
  templateUrl: 'branch.dialog.html',
  providers: [BranchService]
})
export class BranchDialog {
  constructor(
    private dialogRef: MatDialogRef<BranchDialog>,
    public branchSvc: BranchService,
    @Inject(MAT_DIALOG_DATA) public branch: Branch
  ) { }

  saveBranch = async () => {
    const res = this.branch.id > 0
      ? await this.branchSvc.updateBranch(this.branch)
      : await this.branchSvc.addBranch(this.branch);

    res && this.dialogRef.close(true);
  }
}
