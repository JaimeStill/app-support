import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';

import { Plane } from '../models';

@Injectable()
export class PlaneService {
  private plane = new BehaviorSubject<Plane>(null);

  plane$ = this.plane.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getPlane = (id: number): Promise<Plane> => new Promise((resolve) => {
    this.http.get<Plane>(`${this.config.api}plane/getPlane/${id}`)
      .subscribe(
        data => {
          this.plane.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addPlane = (plane: Plane): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}plane/addPlane`, plane)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${plane.name} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updatePlane = (plane: Plane): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}plane/updatePlane`, plane)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${plane.name} successfully updated`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removePlane = (plane: Plane): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}plane/removePlane`, plane)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${plane.name} successfully removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
