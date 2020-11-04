import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ServerConfig } from '../../config';

import {
  SnackerService,
  TriggerService
} from '../../services';

import {
  Person,
  PersonModel,
  Plane,
  PlaneModel,
  Template,
  TemplatePlane,
  TemplatePlanePerson
} from '../models';

@Injectable()
export class TemplateService {
  private people = new BehaviorSubject<PersonModel[]>(null);
  private planes = new BehaviorSubject<Plane[]>(null);
  private template = new BehaviorSubject<Template>(null);
  private templatePlanes = new BehaviorSubject<PlaneModel[]>(null);

  people$ = this.people.asObservable();
  planes$ = this.planes.asObservable();
  template$ = this.template.asObservable();
  templatePlanes$ = this.templatePlanes.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private trigger: TriggerService,
    @Optional() private config: ServerConfig
  ) { }

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

  addTemplate = (template: Template): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/addTemplate`, template)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${template.title} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateTemplate = (template: Template): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/updateTemplate`, template)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${template.title} successfully updated`);
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
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

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

  getTemplatePlanes = (id: number): Promise<PlaneModel[]> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}template/getTemplatePlanes/${id}`)
      .subscribe(
        data => {
          this.templatePlanes.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addTemplatePlanes = (templateId: number, planes: Plane[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/addTemplatePlanes/${templateId}`, planes)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Template planes successfully updated`);
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
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

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

  addTemplatePlanePeople = (templatePlaneId: number, people: Person[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/addTemplatePlanePeople/${templatePlaneId}`, people)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Template plane people successfully updated`);
          this.trigger.setTemplatePeople(templatePlaneId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeTemplatePlanePerson = (p: PersonModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}template/removeTemplatePlanePerson`, { id: p.altId, templatePlaneId: p.parentId, personId: p.id } as TemplatePlanePerson)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${p.lastName}, ${p.firstName} removed from template plane`);
          this.trigger.setTemplatePeople(p.parentId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
