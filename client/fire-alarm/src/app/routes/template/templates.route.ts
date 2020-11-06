import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ConfirmDialog,
  ManifestService,
  OrganizationService,
  Template,
  TemplateDialog,
  TemplateService,
  TemplateSource
} from 'core';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'templates-route',
  templateUrl: 'templates.route.html',
  providers: [
    ManifestService,
    TemplateService,
    TemplateSource
  ]
})
export class TemplatesRoute implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private manifestSvc: ManifestService,
    private router: Router,
    public orgSvc: OrganizationService,
    public templateSrc: TemplateSource,
    public templateSvc: TemplateService
  ) { }

  ngOnInit() {
    this.sub = this.orgSvc.currentOrg$.subscribe(org => org?.id > 0 && this.templateSrc.setBaseUrl(org.id));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addTemplate = () => this.dialog.open(TemplateDialog, {
    data: {} as Template,
    disableClose: true,
    width: '800px'
  })
    .afterClosed()
    .subscribe((res: number) => res && this.router.navigate(['template', res]));

  editTemplate = (template: Template) => this.router.navigate(['template', template.id]);

  generateManifest = (template: Template) => this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Generate Manifest?',
      content: `Generate a manifest based on the ${template.title} template?`
    },
    disableClose: true,
    autoFocus: false
  })
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.manifestSvc.generateManifest(template.id);
        res && this.router.navigate(['manifest', res]);
      }
    });

  removeTemplate = (template: Template) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Delete ${template.title}`,
      content: `Are you sure you want to delete ${template.title}?`
    },
    disableClose: true,
    autoFocus: false
  })
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.templateSvc.removeTemplate(template);
        res && this.templateSrc.forceRefresh();
      }
    })
}
