import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Organization } from '../../models';
import { ServerConfig } from '../../config';
import { SnackerService } from '../snacker.service';
import { SyncSocket } from '../sockets';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private organizations = new BehaviorSubject<Organization[]>(null);
  organizations$ = this.organizations.asObservable();

  private organization = new BehaviorSubject<Organization>(null);
  organization$ = this.organization.asObservable();

  private currentOrg = new BehaviorSubject<Organization>(null);
  currentOrg$ = this.currentOrg.asObservable();

  setCurrentOrg = (org: Organization) => this.currentOrg.next(org);

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
    @Optional() private config: ServerConfig
  ) { }

  getOrganizations = () => this.http.get<Organization[]>(`${this.config.api}organization/getOrganizations`)
    .subscribe(
      data => this.organizations.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getOrganization = (id: number): Promise<Organization> => new Promise((resolve) => {
    this.http.get<Organization>(`${this.config.api}organization/getOrganization/${id}`)
      .subscribe(
        data => {
          this.organization.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  addOrganization = (organization: Organization): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}organization/addOrganization`, organization)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${organization.name} successfully created`);
          this.sync.triggerOrganization(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updateOrganization = (organization: Organization): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}organization/updateOrganization`, organization)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${organization.name} successfully updated`);
          this.sync.triggerOrganization(organization.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeOrganization = (organization: Organization): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}organization/removeOrganization`, organization)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${organization.name} successfully removed`);
          this.sync.triggerOrganization(organization.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
