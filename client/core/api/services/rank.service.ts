import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';
import { Rank } from '../models';

@Injectable()
export class RankService {
  private rank = new BehaviorSubject<Rank>(null);
  rank$ = this.rank.asObservable();

  private ranks = new BehaviorSubject<Rank[]>(null);
  ranks$ = this.ranks.asObservable();


  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

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

  getRanks = () => this.http.get<Rank[]>(`${this.config.api}rank/getRanks`)
    .subscribe(
      data => this.ranks.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  addRank = (rank: Rank): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}rank/addRank`, rank)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${rank.label} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateRank = (rank: Rank): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}rank/updateRank`, rank)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${rank.label} successfully updated`);
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
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
