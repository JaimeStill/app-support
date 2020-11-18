import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Person } from '../../models';
import { ServerConfig } from '../../config';
import { SnackerService } from '../snacker.service';
import { SyncSocket } from '../sockets';

@Injectable()
export class PersonService {
  private person = new BehaviorSubject<Person>(null);
  person$ = this.person.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
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

  addPerson = (person: Person): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}person/addPerson`, person)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${person.nickname} successfully created`);
          this.sync.triggerPerson(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updatePerson = (person: Person): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}person/updatePerson`, person)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.nickname} successfully updated`);
          this.sync.triggerPerson(person.id);
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
          this.sync.triggerPerson(person.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
