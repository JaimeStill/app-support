import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Template } from '../../models';

@Injectable()
export class TemplateSource extends QueryService<Template> implements DataSource<Template> {
  columns = [
    'title',
    'description'
  ];

  constructor(
    protected http: HttpClient,
    protected snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) {
    super(http, snacker);
    this.sort = {
      isDescending: false,
      propertyName: 'title'
    };
  }

  setBaseUrl = (orgId: number) => this.baseUrl = `${this.config.api}template/queryTemplates/${orgId}`;

  trackTemplates = (template: Template) => template.id;
}
