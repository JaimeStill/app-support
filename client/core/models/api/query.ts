import {

} from '@angular/forms';

export interface Query {
  id: number;
  name: string;
  server: string;
  database: string;
  value: string;
  editorFont: string;
  editorFontSize: number;
  editorTabSpacing: number;
}
