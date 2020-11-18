import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Rank } from '../../models';
import { ServerConfig } from '../../config';
import { SnackerService } from '../snacker.service';
import { SyncSocket } from '../sockets';

@Injectable()
export class RankService {
  private rank = new BehaviorSubject<Rank>(null);
  rank$ = this.rank.asObservable();

  private ranks = new BehaviorSubject<Rank[]>(null);
  ranks$ = this.ranks.asObservable();


  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
    @Optional() private config: ServerConfig
  ) { }

  getRanks = (branchId: number) => this.http.get<Rank[]>(`${this.config.api}rank/getRanks/${branchId}`)
    .subscribe(
      data => this.ranks.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getRank = (id: number): Promise<Rank> => new Promise((resolve) => {
    this.http.get<Rank>(`${this.config.api}rank/getRank/${id}`)
      .subscribe(
        data => {
          this.rank.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addRank = (rank: Rank): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}rank/addRank`, rank)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${rank.label} successfully created`);
          this.sync.triggerRank(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updateRank = (rank: Rank): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}rank/updateRank`, rank)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${rank.label} successfully updated`);
          this.sync.triggerRank(rank.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeRank = (rank: Rank): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}rank/removeRank`, rank)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${rank.label} successfully removed`);
          this.sync.triggerRank(rank.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
