import { Component } from '@angular/core';

import {
  ConfirmDialog,
  Person,
  PersonDialog,
  PersonService,
  PersonSource
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'people-route',
  templateUrl: 'people.route.html',
  providers: [
    PersonService,
    PersonSource
  ]
})
export class PeopleRoute {
  constructor(
    private dialog: MatDialog,
    public personSrc: PersonSource,
    public personSvc: PersonService
  ) { }

  addPerson = () => this.dialog.open(PersonDialog, {
    data: { } as Person,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.personSrc.forceRefresh());

  editPerson = (person: Person) => this.dialog.open(PersonDialog, {
    data: person,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.personSrc.forceRefresh());

  removePerson = (person: Person) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Remove ${person.firstName} ${person.lastName}`,
      content: `Are you sure you want to remove ${person.firstName} ${person.lastName}?`
    },
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.personSvc.removePerson(person);
      res && this.personSrc.forceRefresh();
    }
  });
}
