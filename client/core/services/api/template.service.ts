import {
  Injectable,
  Optional
} from '@angular/core';

import {
  Person,
  PersonModel,
  Plane,
  PlaneModel,
  Template,
  TemplatePlane,
  TemplatePerson
} from '../../models';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ServerConfig } from '../../config';
import { SnackerService } from '../snacker.service';
import { SyncSocket } from '../sockets';

@Injectable()
export class TemplateService {
  private people = new BehaviorSubject<PersonModel[]>(null);
  private planes = new BehaviorSubject<Plane[]>(null);
  private templates = new BehaviorSubject<Template[]>(null);
  private template = new BehaviorSubject<Template>(null);
  private templatePlanes = new BehaviorSubject<PlaneModel[]>(null);

  people$ = this.people.asObservable();
  planes$ = this.planes.asObservable();
  templates$ = this.templates.asObservable();
  template$ = this.template.asObservable();
  templatePlanes$ = this.templatePlanes.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
    @Optional() private config: ServerConfig
  ) { }

  //#region Template

  getTemplates = (id: number) => {
    this.http.get<Template[]>(`${this.config.api}template/getTemplates/${id}`)
      .subscribe(
        data => this.templates.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );
  }

  getTemplate = (id: number): Promise<Template> => new Promise((resolve) => {
    this.http.get<Template>(`${this.config.api}template/getTemplate/${id}`)
      .subscribe(
        data => {
          this.template.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addTemplate = (template: Template): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}template/addTemplate`, template)
      .subscribe(
        data => {
          this.sync.triggerTemplate(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  updateTemplate = (template: Template): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/updateTemplate`, template)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${template.title} successfully updated`);
          this.sync.triggerTemplate(template.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeTemplate = (template: Template): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/removeTemplate`, template)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${template.title} successfully removed`);
          this.sync.triggerTemplate(template.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion

  //#region TemplatePlane

  getAvailableTemplatePlanes = (templateId: number, orgId: number): Promise<Plane[]> => new Promise((resolve) => {
    this.http.get<Plane[]>(`${this.config.api}template/getAvailableTemplatePlanes/${templateId}/${orgId}`)
      .subscribe(
        data => {
          this.planes.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  getTemplatePlanes = (id: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}template/getTemplatePlanes/${id}`)
      .subscribe(
        data => {
          this.templatePlanes.next(data);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  getTemplatePlanesWithSpace = (id: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}template/getTemplatePlanesWithSpace/${id}`)
      .subscribe(
        data => {
          this.templatePlanes.next(data);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  addTemplatePlanes = (templateId: number, planes: Plane[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/addTemplatePlanes/${templateId}`, planes)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Template planes successfully updated`);
          this.sync.triggerTemplate(templateId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeTemplatePlane = (p: PlaneModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/removeTemplatePlane`, { id: p.altId, templateId: p.parentId, planeId: p.id } as TemplatePlane)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${p.name} removed from template`);
          this.sync.triggerTemplate(p.parentId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion

  //#region TemplatePerson

  getTemplatePeople = (id: number) => this.http.get<PersonModel[]>(`${this.config.api}template/getTemplatePeople/${id}`)
    .subscribe(
      data => this.people.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchTemplatePeople = (id: number, search: string) => this.http.get<PersonModel[]>(`${this.config.api}template/searchTemplatePeople/${id}/${search}`)
      .subscribe(
        data => this.people.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );

  addTemplatePeople = (templateId: number, templatePlaneId: number, people: Person[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/addTemplatePeople/${templatePlaneId}`, people)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Template plane people successfully updated`);
          this.sync.triggerTemplate(templateId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateTemplatePerson = (person: PersonModel, plane: PlaneModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/updateTemplatePerson`, { id: person.altId, templatePlaneId: plane.altId, personId: person.id } as TemplatePerson)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.lastName}, ${person.firstName} move to ${plane.name}`);
          this.sync.triggerTemplate(plane.parentId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })

  removeTemplatePerson = (templateId: number, p: PersonModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/removeTemplatePerson`, { id: p.altId, templatePlaneId: p.parentId, personId: p.id } as TemplatePerson)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${p.lastName}, ${p.firstName} removed from template plane`);
          this.sync.triggerTemplate(templateId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion
}
