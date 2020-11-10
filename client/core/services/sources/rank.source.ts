import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { QueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Rank } from '../../models';

@Injectable()
export class RankSource extends QueryService<Rank> implements DataSource<Rank> {
  columns = [
    'branch.name',
    'grade',
    'label',
    'name'
  ];

  constructor(
    protected http: HttpClient,
    protected snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) {
    super(http, snacker);
    this.sort = {
      isDescending: false,
      propertyName: 'order'
    };
  }

  setBaseUrl = (branchId: number) => this.baseUrl = `${this.config.api}rank/queryRanks/${branchId}`;

  trackRanks = (rank: Rank) => rank.id;
}
