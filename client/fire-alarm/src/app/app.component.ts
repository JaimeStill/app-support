import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import {
  filter,
  map
} from 'rxjs/operators';

import { MatSelectChange } from '@angular/material/select';

import {
  BannerService,
  Organization,
  OrganizationService,
  ThemeService
} from 'core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private orgRoutes = new Array<string>(
    'home',
    'manifests',
    'templates'
  );

  private subs = new Array<Subscription>();

  orgEnabled = false;
  org: Organization;

  private initializeOrg = (orgs: Organization[]) => {
    if (!this.org) {
      this.org = orgs[0];
      this.orgSvc.setCurrentOrg(this.org);
    }
  }

  constructor(
    private router: Router,
    public banner: BannerService,
    public orgSvc: OrganizationService,
    public themer: ThemeService
  ) { }

  ngOnInit() {
    this.banner.getConfig();
    this.orgSvc.getOrganizations();

    this.subs.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url.split('/'))
      ).subscribe(url =>
        this.orgEnabled = url.some(fragment =>
          this.orgRoutes.includes(fragment)
        )
      ),
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
