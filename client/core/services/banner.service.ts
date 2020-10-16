import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from './snacker.service';
import { ServerConfig } from '../config';
import { BannerConfig } from '../models';
import { Server } from 'http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private config = new BehaviorSubject<BannerConfig>(null);
  config$ = this.config.asObservable();

  constructor(
    private http: HttpClient,
    private server: ServerConfig,
    private snacker: SnackerService
  ) { }

  getConfig = () =>
    this.http.get<BannerConfig>(`${this.server.api}banner/getConfig`)
      .subscribe(
        data => this.config.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );
}
