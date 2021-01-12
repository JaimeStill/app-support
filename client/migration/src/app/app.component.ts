import {
  Component,
  OnInit
} from '@angular/core';

import {
  BannerService,
  ThemeService
} from 'core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    public banner: BannerService,
    public themer: ThemeService
  ) { }

  ngOnInit() {
    this.banner.getConfig();
  }
}
