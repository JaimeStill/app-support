import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  Organization,
  OrganizationService,
  Template,
  TemplateDialog,
  TemplateService,
  TemplateSource
} from 'core';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'templates-route',
  templateUrl: 'templates.route.html',
  providers: [
    OrganizationService,
    TemplateService,
    TemplateSource
  ]
})
export class TemplatesRoute implements OnInit, OnDestroy {
  sub: Subscription;
  org: Organization;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public orgSvc: OrganizationService,
    public templateSrc: TemplateSource,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    this.orgSvc.getOrganizations();

    this.sub = this.orgSvc.organizations$.subscribe(orgs => {
      if (!(this.org) && orgs?.length > 0)
        this.initializeOrg(orgs[0]);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private initializeOrg = (org: Organization) => {
    this.org = org;
    this.templateSrc.setBaseUrl(this.org.id);
  }

  selectOrg = (event: MatSelectChange) => this.initializeOrg(event.value);

  addTemplate = () => this.dialog.open(TemplateDialog, {
    data: {} as Template,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.templateSrc.forceRefresh());

  editTemplate = (template: Template) => this.router.navigate(['template', template.id]);

  removeTemplate = (template: Template) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Delete ${template.title}`,
      content: `Are you sure you want to delete ${template.title}?`
    },
    disableClose: true
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.templateSvc.removeTemplate(template);
      res && this.templateSrc.forceRefresh();
    }
  })
}
