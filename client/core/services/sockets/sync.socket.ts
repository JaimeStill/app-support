import {
  Injectable,
  Optional
} from '@angular/core';

import {
  HubConnection,
  HubConnectionBuilder
} from '@microsoft/signalr';

import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';
import { ServerConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class SyncSocket {
  private endpoint: string;
  private connection: HubConnection;

  // Internal Connection State
  private connected = new BehaviorSubject<boolean>(null);
  private error = new BehaviorSubject<any>(null);

  connected$ = this.connected.asObservable();
  error$ = this.error.asObservable();

  // Event State
  private sync = new BehaviorSubject<boolean>(false);
  private branch = new BehaviorSubject<number>(null);
  private organization = new BehaviorSubject<number>(null);
  private person = new BehaviorSubject<number>(null);
  private plane = new BehaviorSubject<number>(null);
  private rank = new BehaviorSubject<number>(null);
  private template = new BehaviorSubject<number>(null);
  private manifest = new BehaviorSubject<number>(null);

  sync$ = this.sync.asObservable();
  branch$ = this.branch.asObservable();
  organization$ = this.organization.asObservable();
  person$ = this.person.asObservable();
  plane$ = this.plane.asObservable();
  rank$ = this.rank.asObservable();
  template$ = this.template.asObservable();
  manifest$ = this.manifest.asObservable();

  private registerEvents = () => {
    this.connection.on(
      'sync',
      () => this.sync.next(true)
    );

    this.connection.on(
      'syncBranch',
      (id: number) => this.branch.next(id)
    );

    this.connection.on(
      'syncOrganization',
      (id: number) => this.organization.next(id)
    );

    this.connection.on(
      'syncPerson',
      (id: number) => this.person.next(id)
    );

    this.connection.on(
      'syncPlane',
      (id: number) => this.plane.next(id)
    );

    this.connection.on(
      'syncRank',
      (id: number) => this.rank.next(id)
    );

    this.connection.on(
      'syncTemplate',
      (id: number) => this.template.next(id)
    );

    this.connection.on(
      'syncManifest',
      (id: number) => this.manifest.next(id)
    );
  }

  constructor(
    private snacker: SnackerService,
    @Optional() config?: ServerConfig
  ) {
    if (config) {
      this.endpoint = `${config.server}sync`;

      this.connection = new HubConnectionBuilder()
        .withUrl(this.endpoint)
        .withAutomaticReconnect()
        .build();

      this.registerEvents();

      this.connection
        .start()
        .then(() => this.connected.next(true))
        .catch((err) => {
          this.connected.next(false);
          this.error.next(err);
          this.snacker.sendErrorMessage(err.error);
        });
    }
  }

  triggerBranch = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerBranch', id);

      await this.connection
        .invoke('triggerSync');
    }
  }

  triggerOrganization = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerOrganization', id);

      await this.connection
        .invoke('triggerSync');
    }
  }

  triggerPerson = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerPerson', id);

      await this.connection
        .invoke('triggerSync');
    }
  }

  triggerPlane = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerPlane', id);

      await this.connection
        .invoke('triggerSync');
    }
  }

  triggerRank = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerRank', id);

      await this.connection
        .invoke('triggerSync');
    }
  }

  triggerTemplate = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerTemplate', id);
    }
  }

  triggerManifest = async (id: number) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerManifest', id);
    }
  }
}
