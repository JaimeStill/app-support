import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { ApiQueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Person } from '../../models';

@Injectable()
export class ManifestPersonSource extends ApiQueryService<Person> implements DataSource<Person> {
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
