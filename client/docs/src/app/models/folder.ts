import { Document } from './document';

export interface Folder {
  name: string;
  path: string;
  hasReadme: boolean;
  breadcrumbs: string[];
  documents: Document[];
  folders: Folder[];
}
