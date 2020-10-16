import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  ApiComponents,
  ApiDialogs,
  ApiDirectives,
  ApiPipes
} from './api';

import { MaterialModule } from './material.module';
import { ServerConfig } from './config';
import { Components } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';
import { Pipes } from './pipes';

@NgModule({
  declarations: [
    ...ApiComponents,
    ...ApiDialogs,
    ...ApiDirectives,
    ...ApiPipes,
    ...Components,
    ...Dialogs,
    ...Directives,
    ...Pipes
  ],
  entryComponents: [
    ...ApiDialogs,
    ...Dialogs
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ...Components,
    ...Dialogs,
    ...Directives,
    ...Pipes
  ]
})
export class CoreModule {
  static forRoot(config: ServerConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: ServerConfig, useValue: config }
      ]
    };
  }
}
