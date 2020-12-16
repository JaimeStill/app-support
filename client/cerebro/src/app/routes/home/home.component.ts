import {
  Component,
  OnInit
} from '@angular/core';

import {
  ConfirmDialog,
  Query,
  QueryDialog,
  SqlQueryService
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html',
  providers: [ SqlQueryService ]
})
export class HomeComponent implements OnInit {
  query: Query;
  results: any[];

  constructor(
    private dialog: MatDialog,
    public querySvc: SqlQueryService
  ) { }

  ngOnInit() {
    this.querySvc.getQueries();
  }

  selected = (query: Query) => this.query?.id == query?.id;

  selectQuery = (query: Query) => {
    if (!this.selected(query)) {
      this.query = query;
    }
  }

  addQuery = () => this.dialog.open(QueryDialog, {
    data: {
      server: `.\\DevSql`,
      database: `AdventureWorksLT2019`,
      editorFont: 'Cascadia Code',
      editorFontSize: 14,
      editorTabSpacing: 2
    } as Query,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.querySvc.getQueries());

  removeQuery = (query: Query) => this.dialog.open(ConfirmDialog, {
    data: {
      title: `Delete ${query.name}.sql?`,
      content: `Are you sure you want to delete ${query.name}.sql?`
    },
    disableClose: true,
    autoFocus: false
  })
  .afterClosed()
  .subscribe(async result => {
    if (result) {
      const res = await this.querySvc.removeQuery(query);
      res && this.querySvc.getQueries();
    }
  })

  downloadQuery = (query: Query) => this.querySvc.downloadQuery(query);

  forkQuery = (query: Query) => this.dialog.open(QueryDialog, {
    data: Object.assign({} as Query, query, { id: null, name: null }),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.querySvc.getQueries());

  editQuery = (query: Query) => this.dialog.open(QueryDialog, {
    data: Object.assign({} as Query, query),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.querySvc.getQueries());

  closeQuery = () => this.query = this.results = null;

  saveQuery = async () => {
    const res = await this.querySvc.updateQuery(this.query);
    res && this.querySvc.getQueries();
  }

  executeQuery = async () => this.results = await this.querySvc.executeQuery(this.query);
}
