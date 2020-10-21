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
export class PersonSource extends QueryService<Person> implements DataSource<Person> {
  columns = [
    'lastName',
    'firstName',
    'middleName',
    'nickname',
    'occupation',
    'ssn',
    'title',
    'rank.label',
    'rank.branch.name',
    'organization.name'
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
  }

  trackPeople = (person: Person) => person.id;
}
