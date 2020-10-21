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
import { Organization } from '../../models';

@Injectable()
export class OrganizationSource extends QueryService<Organization> implements DataSource<Organization> {
  columns = ['name'];

  constructor(
    protected http: HttpClient,
    protected snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) {
    super(http, snacker);
    this.sort = {
      isDescending: false,
      propertyName: 'name'
    };

    this.baseUrl = `${this.config.api}organization/queryOrganizations`;
  }

  trackOrganizations = (organization: Organization) => organization.id;
}
