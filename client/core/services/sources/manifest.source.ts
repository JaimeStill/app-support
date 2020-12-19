import {
  Injectable,
  Optional
} from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
import { ApiQueryService } from '../abstract';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Manifest } from '../../models';

@Injectable()
export class ManifestSource extends ApiQueryService<Manifest> implements DataSource<Manifest> {
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
  }

  setBaseUrl = (url: string) => this.baseUrl = `${this.config.api}manifest/${url}`;

  trackManifests = (manifest: Manifest) => manifest.id;
}
