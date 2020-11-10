import {
  Injectable,
  Optional
} from '@angular/core';

import {
  QueryService,
  SnackerService
} from '../../../services';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { ServerConfig } from '../../../config';
import { Person } from '../../models';

@Injectable()
export class ManifestPersonSource extends QueryService<Person> implements DataSource<Person> {
  columns = [];

  constructor(
    protected http: HttpClient,
    protected snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) {
    super(http, snacker);
    this.sort = {
      isDescending: false,
      propertyName: 'lastName'
    };
  }

  setBaseUrl = (manifestId: number) => this.baseUrl = `${this.config.api}manifest/queryAvailableManifestPeople/${manifestId}`;

  trackPeople = (person: Person) => person.id;
}
