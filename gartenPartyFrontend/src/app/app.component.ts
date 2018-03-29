import {Component} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public HomeNav = '/';

  constructor(router: Router) {
    router.events.subscribe((url: any) => {
      let navPart = url.url;
      if (navPart !== undefined && navPart.indexOf('?') > 0) {
        navPart = navPart.substring(0, navPart.indexOf('?'));
      }
      return this.HomeNav = navPart;
    });
  }
}
