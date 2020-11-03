import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';
import { Template } from '../models';

@Injectable()
export class TemplateService {
  private template = new BehaviorSubject<Template>(null);
  template$ = this.template.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
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
}
