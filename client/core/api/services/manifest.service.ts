import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';
import { Manifest } from '../models';

@Injectable()
export class ManifestService {
  private manifest = new BehaviorSubject<Manifest>(null);
  manifest$ = this.manifest.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getManifest = (id: number): Promise<Manifest> => new Promise((resolve) => {
    this.http.get<Manifest>(`${this.config.api}manifest/getManifest/${id}`)
      .subscribe(
        data => {
          this.manifest.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  generateManifest = (id: number): Promise<number> => new Promise((resolve) => {
    this.http.get<number>(`${this.config.api}manifest/generateManifest/${id}`)
      .subscribe(
        data => resolve(id),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  addManifest = (manifest: Manifest): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}manifest/addManifest`, manifest)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully created`);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updateManifest = (manifest: Manifest): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/updateManifest`, manifest)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully updated`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeManifest = (manifest: Manifest): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/removeManifest`, manifest)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
