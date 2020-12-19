import {
  Injectable,
  Optional
} from '@angular/core';

import * as marked from 'marked';
import * as prism from 'prismjs';

import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-csharp';

import { ServerConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MarkedService {
  private renderer = new marked.Renderer();
  private parser = marked;

  constructor(
    @Optional() private config: ServerConfig
  ) {
    this.renderer.code = function (code, lang) {
      code = this.options.highlight(code, lang);

      if (!lang) {
        return `<pre><code>${code}</code></pre>`;
      }

      const langClass = `language-${lang}`;

      return `<pre class="prism-theme ${langClass}"><code>${code}</code></pre>`;
    };

    this.parser.setOptions({
      baseUrl: config.server,
      renderer: this.renderer,
      highlight: (code, lang) => prism.highlight(code, prism.languages[lang || 'js'], lang || 'js'),
      gfm: true,
      smartLists: true
    });
  }

  private checkRelative = (href: string): boolean => href.charAt(0) === '.' || href.charAt(0) === '/' || href.charAt(0) === '#';

  private checkAnchor = (href: string): boolean => href.charAt(0) === '#';

  private setBreadcrumbs = (href: string, breadcrumbs: string[]) => `${breadcrumbs.join('/')}/${href}`;

  private updateImage = (breadcrumbs: string[]) => {
    if (breadcrumbs) {
      return (href: string, title: string, text: string) => {
        if (this.checkRelative(href)) {
          const link = `${this.config.server}${this.setBreadcrumbs(href, breadcrumbs)}`;
          return this.renderImage(link, title, text);
        } else {
          return this.renderImage(href, title, text);
        }
      };
    } else {
      return (href: string, title: string, text: string) => this.checkRelative(href)
        ? this.renderImage(`${this.config.server}${href}`, title, text)
        : this.renderImage(href, title, text);
    }
  }

  private renderImage = (src: string, title: string, alt: string): string => title
    ? `<img src="${src}" title="${title}" alt="${alt}"/>`
    : `<img src="${src}" alt="${alt}"/>`

  private updateLink = (doc: string, breadcrumbs: string[]) => {
    if (breadcrumbs) {
      return (href: string, title: string, text: string) => {
        if (this.checkRelative(href)) {
          const link = href.toLowerCase().endsWith('.md')
            ? `${this.setBreadcrumbs(href, breadcrumbs)}`
            : this.checkAnchor(href)
              ? `${this.setBreadcrumbs(`${doc}${href}`, breadcrumbs)}`
              : `${this.config.server}${this.setBreadcrumbs(`${href}`, breadcrumbs)}`;

          return this.renderLink(link, title, text);
        } else {
          return this.renderLink(href, title, text);
        }
      };
    } else {
      return (href: string, title: string, text: string) => {
        if (this.checkRelative(href)) {
          return href.toLowerCase().endsWith('.md')
            ? this.renderLink(href, title, text)
            : this.checkAnchor(href)
              ? this.renderLink(`${doc}${href}`, title, text)
              : this.renderLink(`${this.config.server}${href}`, title, text);
        } else {
          return this.renderLink(href, title, text);
        }
      };
    }
  }

  private renderLink = (href: string, title: string, text: string) => title
    ? `<a href="${href}" title="${title}">${text}</a>`
    : `<a href="${href}">${text}</a>`

  private updateRenderer = (doc: string, breadcrumbs: string[]) => {
    this.renderer.image = this.updateImage(breadcrumbs);
    this.renderer.link = this.updateLink(doc, breadcrumbs);
  }

  convert = (markdown: string, doc: string, breadcrumbs: string[]) => {
    this.updateRenderer(doc, breadcrumbs);
    return this.parser.parse(markdown);
  }
}
