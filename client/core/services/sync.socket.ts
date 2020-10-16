import {
  Injectable,
  Optional
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
  HubConnection,
  HubConnectionBuilder
} from '@microsoft/signalr';

import { SnackerService } from './snacker.service';
import { ServerConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SyncSocket {
  private endpoint = 'http://localhost:5000/sync';
  private connection: HubConnection;

  private connected = new BehaviorSubject<boolean>(null);
  private error = new BehaviorSubject<any>(null);

  connected$ = this.connected.asObservable();
  error$ = this.error.asObservable();

  constructor(
    private snacker: SnackerService,
    @Optional() config?: ServerConfig
  ) {
    if (config) { this.endpoint = `${config.server}sync`; }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.endpoint)
      .build();

    this.connection.on(
      'syncMessage',
      (message: string) => this.snacker.sendColorMessage(message, ['snacker-teal'])
    );

    this.connection
      .start()
      .then(() => this.connected.next(true))
      .catch((err) => {
        this.connected.next(false);
        this.error.next(err);
        this.snacker.sendErrorMessage(err.error);
      });
  }

  triggerMessage = async (message: string) => {
    if (this.connected.value) {
      await this.connection
        .invoke('triggerMessage', message);
    }
  }
}
