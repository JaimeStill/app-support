import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Plane } from '../../models';

@Injectable()
export class PlaneSource extends QueryService<Plane> implements DataSource<Plane> {
  columns = [
    'capacity',
    'name',
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
      propertyName: 'name'
    };

    this.baseUrl = `${this.config.api}plane/queryPlanes`;
  }

  trackPlanes = (plane: Plane) => plane.id;
}
