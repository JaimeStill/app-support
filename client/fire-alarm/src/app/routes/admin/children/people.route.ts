import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ConfirmDialog,
  Person,
  PersonDialog,
  PersonService,
  PersonSource
} from 'core';

@Component({
  selector: 'people-route',
  templateUrl: 'people.route.html',
  providers: [PersonService, PersonSource]
})
export class PeopleRoute {
  constructor(
    private dialog: MatDialog,
    public personSrc: PersonSource,
    public personSvc: PersonService
  ) { }

  addPerson = () => this.dialog.open(PersonDialog, {
    data: {} as Person,
    disableClose: true,
    width: '600px'
  })
    .afterClosed()
    .subscribe(res => res && this.personSrc.forceRefresh());

  editPerson = (p: Person) => this.dialog.open(PersonDialog, {
    data: p,
    disableClose: true,
    width: '600px'
  })
    .afterClosed()
    .subscribe(res => res && this.personSrc.forceRefresh());

  removePerson = (p: Person) => this.dialog.open(ConfirmDialog, {
    disableClose: true
  })
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.personSvc.removePerson(p);
        res && this.personSrc.forceRefresh();
      }
    })
}
