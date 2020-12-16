import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  Subscription,
  fromEvent
} from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  map
} from 'rxjs/operators';

import { Query } from '../../models';

@Component({
  selector: 'query-editor',
  templateUrl: 'query-editor.component.html',
  styleUrls: ['query-editor.component.css']
})
export class QueryEditorComponent implements AfterViewInit, OnDestroy {
  private sub: Subscription;

  @ViewChild('editor') editor: ElementRef;
  @Input() query: Query;
  @Input() interval = 250;
  @Input() padding = 8;
  @Input() resize = false;
  @Output() sync = new EventEmitter<string>();

  ngAfterViewInit() {
    this.sub = fromEvent(this.editor.nativeElement, 'keyup')
      .pipe(
        debounceTime(this.interval),
        map((event: any) => event.target.value),
        distinctUntilChanged()
      )
      .subscribe(value => this.sync.emit(value))
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkInput = (event: any) => {
    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const value = event.target.value;
        const spacing = ' '.repeat(this.query.editorTabSpacing)
        event.target.value = `${value.substring(0, start)}${spacing}${value.substring(end, value.length)}`;
        event.target.selectionStart = event.target.selectionEnd = start + spacing.length;
        break;
    }
  }
}
