import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ConfirmDialog,
  PersonModel,
  Plane,
  PlaneModel,
  Template,
  TemplatePlane,
  TemplatePerson,
  TemplateDialog,
  TemplatePeopleDialog,
  TemplatePlaneDialog,
  TemplateTransferDialog,
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
    this.templateSvc.getTemplatePlanes(id);
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

  managePlanes = (template: Template) => this.dialog.open(TemplatePlaneDialog, {
    data: template,
    disableClose: true,
    width: '1200px'
  })
  .afterClosed()
  .subscribe(res => res && this.templateSvc.getTemplatePlanes(template.id));

  addPeople = (p: PlaneModel) => this.dialog.open(TemplatePeopleDialog, {
    data: p,
    disableClose: true,
    width: '1200px'
  })
  .afterClosed()
  .subscribe(res => res && this.templateSvc.getTemplatePlanes(p.parentId));

  removePlane = (p: PlaneModel) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Remove ${p.name}`,
      content: `Are you sure you want to remove ${p.name} (and all of its passengers) from the template?`
    },
    disableClose: true
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.templateSvc.removeTemplatePlane(p);
      res && this.templateSvc.getTemplatePlanes(p.parentId);
    }
  })

  removePerson = (p: PersonModel, t: Template) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Remove ${p.lastName}, ${p.firstName}`,
      content: `Are you sure you want to remove ${p.lastName}, ${p.firstName} from the plane?`
    },
    disableClose: true
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
     const res = await this.templateSvc.removeTemplatePerson(p);
     res && this.templateSvc.getTemplatePlanes(t.id);
    }
  });

  transferPerson = (p: PersonModel, t: Template) => this.dialog.open(TemplateTransferDialog, {
    data: { person: p, templateId: t.id } as { person: PersonModel, templateId: number },
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.templateSvc.getTemplatePlanes(t.id));
}
