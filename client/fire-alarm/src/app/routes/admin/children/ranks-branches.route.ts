import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Branch,
  Rank,
  BranchDialog,
  ConfirmDialog,
  RankDialog,
  BranchService,
  BranchSource,
  RankService,
  RankSource,
  SyncSocket
} from 'core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ranks-branches-route',
  templateUrl: 'ranks-branches.route.html',
  providers: [
    BranchService,
    BranchSource,
    RankService,
    RankSource
  ]
})
export class RanksBranchesRoute implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();
  branch: Branch;

  constructor(
    private dialog: MatDialog,
    private sync: SyncSocket,
    public branchSvc: BranchService,
    public branchSrc: BranchSource,
    public rankSvc: RankService,
    public rankSrc: RankSource
  ) { }

  ngOnInit() {
    this.subs.push(
      this.sync
        .branch$
        .subscribe(() => this.branchSrc.forceRefresh()),
      this.sync
        .rank$
        .subscribe(() => this.branch && this.rankSrc.forceRefresh())
    )
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  addBranch = () => this.dialog.open(BranchDialog, {
    data: {} as Branch,
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.branchSrc.forceRefresh());

  addRank = () => this.dialog.open(RankDialog, {
    data: {} as Rank,
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.rankSrc.baseUrl && this.rankSrc.forceRefresh());

  selectBranch = (b: Branch) => {
    if (this.branch?.id === b.id) {
      this.branch = null;
    } else {
      this.branch = b;
      this.rankSrc.setBaseUrl(b.id);
    }
  }

  editBranch = (b: Branch) => this.dialog.open(BranchDialog, {
    data: Object.assign({} as Branch, b),
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.branchSrc.forceRefresh());

  removeBranch = (b: Branch) => this.dialog.open(ConfirmDialog, {
    disableClose: true,
    data: {
      title: 'Remove Branch?',
      content: `Are you sure you want to remove ${b.name}?`
    },
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    const res = await this.branchSvc.removeBranch(b);
    res && this.branchSrc.forceRefresh();
  })

  editRank = (r: Rank) => this.dialog.open(RankDialog, {
    data: Object.assign({} as Rank, r),
    disableClose: true,
    width: '600px'
  })
  .afterClosed()
  .subscribe(res => res && this.rankSrc.baseUrl && this.rankSrc.forceRefresh());

  removeRank = (r: Rank) => this.dialog.open(ConfirmDialog, {
    disableClose: true,
    data: {
      title: 'Remove Rank?',
      content: `Are you sure you want to remove ${r.label} - ${r.name}?`
    },
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.rankSvc.removeRank(r);
      res && this.rankSrc.forceRefresh();
    }
  });
}
