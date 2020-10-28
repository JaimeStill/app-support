import {
  Injectable,
  Optional
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../../services';
import { ServerConfig } from '../../config';
import { Organization } from '../models';

@Injectable()
export class OrganizationService {
  private organizations = new BehaviorSubject<Organization[]>(null);
  organizations$ = this.organizations.asObservable();

  private organization = new BehaviorSubject<Organization>(null);
  organization$ = this.organization.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
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

  addOrganization = (organization: Organization): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}organization/addOrganization`, organization)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${organization.name} successfully created`);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateOrganization = (organization: Organization): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}organization/updateOrganization`, organization)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${organization.name} successfully updated`);
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
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })
}
