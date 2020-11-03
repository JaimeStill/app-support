import { Route } from '@angular/router';
import { TemplatesRoute } from './templates.route';
import { TemplateRoute } from './template.route';

export const TemplateRouteComponents = [
  TemplatesRoute,
  TemplateRoute
]

export const TemplateRoutes: Route[] = [
  { path: 'templates', component: TemplatesRoute },
  { path: 'template/:id', component: TemplateRoute }
]
