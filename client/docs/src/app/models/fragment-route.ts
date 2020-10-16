import { UrlSegment } from '@angular/router';

export interface FragmentRoute {
  url: UrlSegment[];
  fragment: string;
}
