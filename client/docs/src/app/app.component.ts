import { Component } from '@angular/core';
import { ThemeService } from 'core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    public themer: ThemeService
  ) { }
}
