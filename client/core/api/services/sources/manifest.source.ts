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
import { Manifest } from '../../models';

@Injectable()
export class ManifestSource extends QueryService<Manifest> implements DataSource<Manifest> {
  columns = [
    'title',
    'description',
    'dateCreated',
    'dateExpected'
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

    this.baseUrl = `${this.config.api}manifest/queryManifests`;
  }

  trackManifests = (manifest: Manifest) => manifest.id;
}
