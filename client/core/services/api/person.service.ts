import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';
import { Person } from '../../models';

@Injectable()
export class PersonService {
  private person = new BehaviorSubject<Person>(null);
  person$ = this.person.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    @Optional() private config: ServerConfig
  ) { }

  getPerson = (id: number): Promise<Person> => new Promise((resolve) => {
    this.http.get<Person>(`${this.config.api}person/getPerson/${id}`)
      .subscribe(
        data => {
          this.person.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addPerson = (person: Person): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}person/addPerson`, person)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.nickname} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updatePerson = (person: Person): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}person/updatePerson`, person)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.nickname} successfully updated`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removePerson = (person: Person): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}person/removePerson`, person)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.nickname} successfully removed`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
