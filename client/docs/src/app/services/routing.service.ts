import { Injectable } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';

import {
  Document,
  Folder
} from '../models';

import { ContentService } from './content.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RoutingService {
  document: Document;
  folder: Folder;

  constructor(
    private content: ContentService,
    private router: Router
  ) { }

  private loadReadme = async () => this.document = this.folder.breadcrumbs
    ? await this.content.getDocument(`${this.folder.breadcrumbs.join('/')}/readme.md`)
    : await this.content.getDocument(`readme.md`)

  reset = () => {
    this.document = null;
    this.folder = null;
  }

  loadData = async (url: UrlSegment[]) => {
    if (url.length > 0) {
      const paths = url.map(segment => segment.path);

      if (paths[paths.length - 1].toLowerCase().endsWith('.md')) {
        this.document = await this.content.getDocument(paths.join('/'));

        this.folder = paths.length > 1
          ? await this.content.getFolder(paths.slice(0, paths.length - 1).join('/'))
          : await this.content.getFolder(environment.root);
      } else {
        this.folder = await this.content.getFolder(paths.join('/'));

        if (!this.folder) {
          this.router.navigate([''], { fragment: null });
        } else {
          if (this.folder.hasReadme) await this.loadReadme();
        }
      }
    } else {
      this.folder = await this.content.getFolder(environment.root);
      if (this.folder.hasReadme) await this.loadReadme();
    }
  }

  setRootName = (): string => {
    if (environment.root) {
      const rootArray = environment.root.split('/');

      return this.folder.name === rootArray[rootArray.length - 1]
        ? '/'
        : this.folder.name;
    } else {
      return this.folder.name === 'wwwroot'
        ? '/'
        : this.folder.name;
    }
  }
}
