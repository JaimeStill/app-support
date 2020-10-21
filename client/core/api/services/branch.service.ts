import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';
import { Branch } from '../models';

@Injectable()
export class BranchService {
  private branch = new BehaviorSubject<Branch>(null);
  branch$ = this.branch.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getBranch = (id: number): Promise<Branch> => new Promise((resolve) => {
    this.http.get<Branch>(`${this.config.api}branch/getBranch/${id}`)
      .subscribe(
        data => {
          this.branch.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addBranch = (branch: Branch): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}branch/addBranch`, branch)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${branch.name} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateBranch = (branch: Branch): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}branch/updateBranch`, branch)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${branch.name} successfully updated`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeBranch = (branch: Branch): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}branch/removeBranch`, branch)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${branch.name} successfully removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
