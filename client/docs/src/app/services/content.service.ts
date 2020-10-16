import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {
  Document,
  Folder
} from '../models';

const api = environment.api;

@Injectable()
export class ContentService {

  constructor(
    private http: HttpClient
  ) { }

  getFolder = (path: string) => {
    const route = path
      ? `${api}markdown/getFolder/${path}`
      : `${api}markdown/getFolder/`;

    return this.http.get<Folder>(route)
      .toPromise();
  }

  getDocument = (path: string) =>
    this.http.get<Document>(`${api}markdown/getDocument/${path}`)
      .toPromise()
}
