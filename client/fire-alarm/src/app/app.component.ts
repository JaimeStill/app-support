import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Organization } from 'client/core';

import {
  BannerService,
  OrganizationService,
  ThemeService
} from 'core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();
  org: Organization;

  private initializeOrg = (orgs: Organization[]) => {
    if (!this.org) {
      this.org = orgs[0];
      this.orgSvc.setCurrentOrg(this.org);
    }
  }

  constructor(
    public banner: BannerService,
    public orgSvc: OrganizationService,
    public themer: ThemeService
  ) { }

  ngOnInit() {
    this.banner.getConfig();
    this.orgSvc.getOrganizations();

    this.subs.push(
      this.orgSvc.currentOrg$.subscribe(o => this.org = o ? o : null),
      this.orgSvc.organizations$.subscribe(orgs => orgs?.length > 0 && this.initializeOrg(orgs))
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private updateOrg = (org: Organization) => {
    this.org = org;
    this.orgSvc.setCurrentOrg(org);
  }

  selectOrg = (event: MatSelectChange) => this.updateOrg(event.value);
}
