import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Branch } from '../../models';
import { ServerConfig } from '../../config';
import { SnackerService } from '../snacker.service';
import { SyncSocket } from '../sockets';

@Injectable()
export class BranchService {
  private branches = new BehaviorSubject<Branch[]>(null);
  branches$ = this.branches.asObservable();

  private branch = new BehaviorSubject<Branch>(null);
  branch$ = this.branch.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
    @Optional() private config: ServerConfig
  ) { }

  getBranches = () => this.http.get<Branch[]>(`${this.config.api}branch/getBranches`)
    .subscribe(
      data => this.branches.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

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

  addBranch = (branch: Branch): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}branch/addBranch`, branch)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${branch.name} successfully created`);
          this.sync.triggerBranch(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updateBranch = (branch: Branch): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}branch/updateBranch`, branch)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${branch.name} successfully updated`);
          this.sync.triggerBranch(branch.id);
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
          this.sync.triggerBranch(branch.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
