import {
  Injectable,
  Optional
} from '@angular/core';

import {
  Manifest,
  ManifestPerson,
  ManifestPlane,
  Person,
  PersonModel,
  Plane,
  PlaneModel
} from '../../models';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ServerConfig } from '../../config';
import { SyncSocket } from '../sockets';
import { SnackerService } from '../snacker.service';

@Injectable()
export class ManifestService {
  private manifest = new BehaviorSubject<Manifest>(null);
  private planes = new BehaviorSubject<Plane[]>(null);
  private manifestPlanes = new BehaviorSubject<PlaneModel[]>(null);
  private people = new BehaviorSubject<PersonModel[]>(null);

  manifest$ = this.manifest.asObservable();
  planes$ = this.planes.asObservable();
  manifestPlanes$ = this.manifestPlanes.asObservable();
  people$ = this.people.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private sync: SyncSocket,
    @Optional() private config: ServerConfig
  ) { }

  //#region Manifest

  getManifest = (id: number): Promise<Manifest> => new Promise((resolve) => {
    this.http.get<Manifest>(`${this.config.api}manifest/getManifest/${id}`)
      .subscribe(
        data => {
          this.manifest.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  generateManifest = (id: number): Promise<number> => new Promise((resolve) => {
    this.http.get<number>(`${this.config.api}manifest/generateManifest/${id}`)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      )
  })

  createManifestSpreadsheet = (id: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<HttpResponse<Blob>>(`${this.config.api}manifest/createManifestSpreadsheet/${id}`, { responseType: 'blob', observe: 'response' } as Object)
      .subscribe(
        data => {
          const filename = data.headers
            .get('content-disposition')
            .split(';')
            .filter(value => value.includes('filename='))[0]
            .split('=')[1];

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data.body);
          link.download = filename;
          link.click();

          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })

  addManifest = (manifest: Manifest): Promise<number> => new Promise((resolve) => {
    this.http.post<number>(`${this.config.api}manifest/addManifest`, manifest)
      .subscribe(
        data => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully created`);
          this.sync.triggerManifest(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(0);
        }
      );
  })

  updateManifest = (manifest: Manifest): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/updateManifest`, manifest)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully updated`);
          this.sync.triggerManifest(manifest.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  toggleManifestClosed = (manifest: Manifest): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/toggleManifestClosed`, manifest)
      .subscribe(
        () => {
          const message = manifest.isClosed
            ? `${manifest.title} set to Open`
            : `${manifest.title} set to Closed`;

          this.snacker.sendSuccessMessage(message);
          this.sync.triggerManifest(manifest.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeManifest = (manifest: Manifest): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/removeManifest`, manifest)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${manifest.title} successfully removed`);
          this.sync.triggerManifest(manifest.id);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion

  //#region ManifestPlane

  getAvailableManifestPlanes = (manifestId: number, orgId: number): Promise<Plane[]> => new Promise((resolve) => {
    this.http.get<Plane[]>(`${this.config.api}manifest/getAvailableManifestPlanes/${manifestId}/${orgId}`)
      .subscribe(
        data => {
          this.planes.next(data);
          resolve(data);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(null);
        }
      );
  })

  getManifestPlanes = (id: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}manifest/getManifestPlanes/${id}`)
      .subscribe(
        data => {
          this.manifestPlanes.next(data);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  getManifestPlanesWithSpace = (id: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}manifest/getManifestPlanesWithSpace/${id}`)
      .subscribe(
        data => {
          this.manifestPlanes.next(data);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  getAvailablePlanesWithSpace = (id: number, planeId: number): Promise<boolean> => new Promise((resolve) => {
    this.http.get<PlaneModel[]>(`${this.config.api}manifest/getManifestPlanesWithSpace/${id}`)
      .subscribe(
        data => {
          this.manifestPlanes.next(data.filter(p => p.altId !== planeId));
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  addManifestPlanes = (manifestId: number, planes: Plane[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/addManifestPlanes/${manifestId}`, planes)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Manifest planes successfully updated`);
          this.sync.triggerManifest(manifestId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  removeManifestPlane = (p: PlaneModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/removeManifestPlane`, { id: p.altId, manifestId: p.parentId, planeId: p.id } as ManifestPlane)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${p.name} removed from manifest`);
          this.sync.triggerManifest(p.parentId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion

  //#region ManifestPerson

  getManifestPeople = (id: number) => this.http.get<PersonModel[]>(`${this.config.api}manifest/getManifestPeople/${id}`)
    .subscribe(
      data => this.people.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchManifestPeople = (id: number, search: string) => this.http.get<PersonModel[]>(`${this.config.api}manifest/searchManifestPeople/${id}/${search}`)
      .subscribe(
        data => this.people.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );

  addManifestPeople = (manifestId: number, manifestPlaneId: number, people: Person[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/addManifestPeople/${manifestPlaneId}`, people)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`Manifest plane people successfully updated`);
          this.sync.triggerManifest(manifestId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  updateManifestPerson = (person: PersonModel, plane: PlaneModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/updateManifestPerson`, {
      id: person.altId,
      manifestPlaneId: plane.altId,
      personId: person.id,
      organizationId: person.organizationId,
      rankId: person.rankId,
      travelerId: person.travelerId,
      firstName: person.firstName,
      lastName: person.lastName,
      middleName: person.middleName,
      nickname: person.nickname,
      occupation: person.occupation,
      title: person.title
    } as ManifestPerson)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${person.lastName}, ${person.firstName} move to ${plane.name}`);
          this.sync.triggerManifest(plane.parentId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  })

  removeManifestPerson = (manifestId: number, p: PersonModel): Promise<boolean> => new Promise((resolve) => {
    this.http.post(`${this.config.api}manifest/removeManifestPerson`, { id: p.altId, manifestPlaneId: p.parentId, personId: p.id } as ManifestPerson)
      .subscribe(
        () => {
          this.snacker.sendSuccessMessage(`${p.lastName}, ${p.firstName} removed from manifest plane`);
          this.sync.triggerManifest(manifestId);
          resolve(true);
        },
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      );
  })

  //#endregion
}
