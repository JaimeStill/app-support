import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  UrlSegment
} from '@angular/router';

import {
  map,
  withLatestFrom
} from 'rxjs/operators';

import { Subscription } from 'rxjs';

import {
  MarkedService,
  ThemeService
} from 'core';

import {
  Document,
  Folder,
  FragmentRoute
} from '../../models';

import { RoutingService } from '../../services';

@Component({
  selector: 'home-route',
  templateUrl: 'home.component.html',
  providers: [
    MarkedService,
    RoutingService
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Array<Subscription>();

  preview = false;
  expanded = true;
  outlet: HTMLElement;

  constructor(
    private self: ElementRef,
    private marked: MarkedService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    public routing: RoutingService,
    public themer: ThemeService
  ) { }

  private scrollAnchor = (fragment: string) => {
    const anchor = this.outlet.querySelector(`#${fragment}`) as HTMLHeadingElement;
    anchor.scrollIntoView({ behavior: 'smooth' });
  }

  private render = (fragment: string) => {
    const doc = this.marked.convert(
      this.routing.document.contents,
      this.routing.document.name,
      this.routing.folder.breadcrumbs
    );

    this.renderer.setProperty(this.outlet, 'innerHTML', doc);

    if (fragment) {
      const images = this.outlet.querySelectorAll('img');

      if (images.length > 0) {
        let loaded = 0;

        images.forEach((img: HTMLImageElement) =>
          img.addEventListener('load', () => {
            loaded++;
            if (loaded === images.length) {
              this.scrollAnchor(fragment);
              images.forEach((i: HTMLImageElement) => i.removeEventListener('load', null));
            }
          }));
      } else {
        this.scrollAnchor(fragment);
      }
    }
  }

  private initialize = async (url: UrlSegment[], fragment: string) => {
    await this.routing.loadData(url);
    if (this.routing.document) this.render(fragment);
  }

  private clearOutlet = () => {
    if (this.outlet && this.outlet.hasChildNodes()) {
      const nodes = this.outlet.childNodes;
      nodes.forEach(n => this.outlet.removeChild(n));
    }
  }

  private createFragmentRoute(val: [UrlSegment[], string]) {
    return {
      url: val[0],
      fragment: val[1]
    } as FragmentRoute;
  }

  ngOnInit() {
    this.outlet = this.self.nativeElement.querySelector('#renderOutlet');

    this.subs.push(
      this.route.url
        .pipe(
          withLatestFrom(this.route.fragment),
          map(val => this.createFragmentRoute(val))
        )
        .subscribe(data => {
          this.clearOutlet();
          this.routing.reset();
          this.initialize(data.url, data.fragment);
        })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  toggleExpanded = () => this.expanded = !this.expanded;

  navigateUp = (folder: Folder) => this.router.navigate(
    folder && folder.breadcrumbs && folder.breadcrumbs.length > 1
      ? folder.breadcrumbs.slice(0, folder.breadcrumbs.length - 1)
      : ['/']
  )

  selectDocument = (document: Document) => {
    this.router.navigate([...document.breadcrumbs, document.name], { fragment: null });
  }

  selectFolder = (folder: Folder) => folder.breadcrumbs
    ? this.router.navigate([...folder.breadcrumbs], { fragment: null })
    : this.router.navigate([''], { fragment: null })
}
