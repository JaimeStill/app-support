import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Branch } from '../../models';

@Injectable()
export class BranchSource extends QueryService<Branch> implements DataSource<Branch> {
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

    this.baseUrl = `${this.config.api}branch/queryBranches`;
  }

  trackBranches = (branch: Branch) => branch.id;
}
