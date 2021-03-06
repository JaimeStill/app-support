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
export class PersonSource extends ApiQueryService<Person> implements DataSource<Person> {
  columns = [
    'ssn',
    'rank.label',
    'lastName',
    'firstName',
    'middleName',
    'rank.branch.name',
    'organization.name',
    'title',
    'nickname',
    'occupation',
    'dodId',
    'actions'
  ];

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

    this.baseUrl = `${this.config.api}person/queryPeople`;
    this.pageSize = 50;
  }

  trackPeople = (person: Person) => person.id;
}
