import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Template,
  TemplateDialog,
  TemplatePeopleDialog,
  TemplateService
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'template-route',
  templateUrl: 'template.route.html',
  providers: [TemplateService]
})
export class TemplateRoute implements OnInit {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public templateSvc: TemplateService
  ) { }

  private navigate = () => this.router.navigate(['templates']);

  private loadTemplate = async (id: number) => {
    const res = await this.templateSvc.getTemplate(id);
    if (!res) this.navigate();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params) {
        if (params.has('id')) {
          const id = Number.parseInt(params.get('id'));
          this.loadTemplate(id);
        } else
          this.navigate();
      }
    })
  }

  editTemplate = (template: Template) => this.dialog.open(TemplateDialog, {
    data: template,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.templateSvc.getTemplate(template.id));

  managePlanes = (template: Template) => { }

  testPeopleDialog = (template: Template) => this.dialog.open(TemplatePeopleDialog, {
    data: template,
    disableClose: true,
    width: '1200px'
  });
}
