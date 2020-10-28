import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import { Rank } from '../../models';

import {
  BranchService,
  RankService
} from '../../services';

@Component({
  selector: 'rank-dialog',
  templateUrl: 'rank.dialog.html',
  providers: [BranchService, RankService]
})
export class RankDialog implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<RankDialog>,
    public branchSvc: BranchService,
    public rankSvc: RankService,
    @Inject(MAT_DIALOG_DATA) public rank: Rank
  ) { }

  ngOnInit() {
    this.branchSvc.getBranches();
  }

  saveRank = async () => {
    const res = this.rank.id > 0
      ? await this.rankSvc.updateRank(this.rank)
      : await this.rankSvc.addRank(this.rank);

    res && this.dialogRef.close(true);
  }
}
