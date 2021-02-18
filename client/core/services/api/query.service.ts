import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';
import { Query } from '../../models';
import { ServerConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private queries = new BehaviorSubject<Query[]>(null);
  private query = new BehaviorSubject<Query>(null);

  queries$ = this.queries.asObservable();
  query$ = this.query.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getQueries = () => this.http.get<Query[]>(`${this.config.api}query/getQueries`)
    .subscribe(
      data => this.queries.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getQuery = (name: string): Promise<Query> => new Promise((resolve) => {
    this.http.get<Query>(`${this.config.api}query/getQuery/${name}`)
      .subscribe(
        data => {
          this.query.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  validateQueryName = (query: Query): Promise<boolean> => new Promise((resolve) => {
    this.http.post<boolean>(`${this.config.api}query/validateQueryName`, query)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  downloadQuery = (query: Query) => {
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(query.value)}`;
    link.download = `${query.name}.sql`;
    link.click();
  }

  executeQuery = (query: Query): Promise<any[]> => new Promise((resolve) => {
    this.http.post<any[]>(`${this.config.api}query/executeQuery`, query)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null)
        }
      )
  })

  executeTypedQuery<T>(query: Query): Promise<T[]> {
    return new Promise((resolve => {
      this.http.post<T[]>(`${this.config.api}query/executeQuery`, query)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    }))
  }

  executeTypedQueryWithProps<T>(query: Query, props: string): Promise<T[]> {
    return new Promise((resolve => {
      this.http.post<T[]>(`${this.config.api}query/executeQueryWithProps/${props}`, query)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    }))
  }

  addQuery = (query: Query): Promise<Query> => new Promise((resolve) => {
    this.http.post<Query>(`${this.config.api}query/addQuery`, query)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${query.name} successfully created`);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  updateQuery = (query: Query): Promise<Query> => new Promise((resolve) => {
    this.http.post<Query>(`${this.config.api}query/updateQuery`, query)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${query.name} successfully updated`);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  removeQuery = (query: Query): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}query/removeQuery`, query)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${query.name} successfully removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })
}
