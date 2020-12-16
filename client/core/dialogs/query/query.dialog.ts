import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  Component,
  Inject,
  AfterContentChecked,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  Subscription,
  fromEvent
} from 'rxjs';

import {
  debounceTime,
  map
} from 'rxjs/operators';

import {
  CoreService,
  SnackerService,
  SqlQueryService
} from '../../services';

import { MatSliderChange } from '@angular/material/slider';
import { Query } from '../../models';

@Component({
  selector: 'query-dialog',
  templateUrl: 'query.dialog.html'
})
export class QueryDialog implements AfterContentChecked, AfterViewInit, OnInit, OnDestroy {
  private sub: Subscription;

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('queryName') queryName: ElementRef;
  validName = true;

  constructor(
    private core: CoreService,
    private dialogRef: MatDialogRef<QueryDialog>,
    private snacker: SnackerService,
    @Inject(MAT_DIALOG_DATA) public query: Query,
    public querySvc: SqlQueryService
  ) { }

  ngAfterContentChecked() {
    if (this.editor) this.editor.nativeElement.value =
      JSON.stringify(this.query, null, this.query?.editorTabSpacing);
  }

  ngAfterViewInit() {
    this.sub = fromEvent(this.queryName.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        map((event: any) => {
          let name = event.target.value;
          name = this.core.urlEncode(name);
          name = name.replace('.sql', '');

          return name;
        })
      )
      .subscribe(async val => {
        this.query.name = val;
        this.validName = await this.querySvc.validateQueryName(this.query);
      })
  }

  ngOnInit() {
    this.query = this.query
      ? this.query
      : {
        database: 'AdventureWorksLT2019',
        editorFont: 'Cascadia Code',
        editorFontSize: 14,
        editorTabSpacing: 2,
        server: `.\\DevSql`
      } as Query;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateFontSize = (event: MatSliderChange) => this.query.editorFontSize = event.value;
  updateTabSpacing = (event: MatSliderChange) => this.query.editorTabSpacing = event.value;

  saveQuery = async () => {
    if (this.query.name) {

      this.query.name.replace('.sql', '');

      const res = this.query.id
        ? await this.querySvc.updateQuery(this.query)
        : await this.querySvc.addQuery(this.query);

      res && this.dialogRef.close(true);

    } else {
      this.snacker.sendErrorMessage('Query must have a name!');
      this.validName = false;
    }
  }
}
