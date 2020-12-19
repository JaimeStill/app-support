import {
  Component,
  OnInit
} from '@angular/core';

import {
  ConfirmDialog,
  Query,
  QueryDialog,
  QueryService
} from 'core';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html',
  providers: [ QueryService ]
})
export class HomeComponent implements OnInit {
  query: Query;
  results: any[];

  constructor(
    private dialog: MatDialog,
    public querySvc: QueryService
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
  .subscribe((res: Query) => {
    if (res) {
      this.query = res;
      this.querySvc.getQueries();
    }
  })

  forkQuery = (query: Query) => this.dialog.open(QueryDialog, {
    data: Object.assign({} as Query, query, { id: null, name: null }),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe((res: Query) => {
    if (res) {
      this.query = res;
      this.querySvc.getQueries();
    }
  });

  editQuery = (query: Query) => this.dialog.open(QueryDialog, {
    data: Object.assign({} as Query, query),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe((res: Query) => {
    if (res) {
      this.query = res;
      this.querySvc.getQueries();
    }
  });

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

      if (res) {
        this.query = this.query.id === query.id
          ? null
          : this.query;

        this.querySvc.getQueries();
      }
    }
  })

  saveQuery = async () => {
    const res = await this.querySvc.updateQuery(this.query);

    if (res) {
      this.query = res;
      this.querySvc.getQueries();
    }
  }

  downloadQuery = (query: Query) => this.querySvc.downloadQuery(query);

  closeQuery = () => this.query = this.results = null;

  executeQuery = async () => this.results = await this.querySvc.executeQuery(this.query);
}
