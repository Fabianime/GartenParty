import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './services/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public HomeNav = '/';
  public bLogin = false;
  public gartenPartyID = this.loginService.getGartenPartyID();

  constructor(router: Router,
              private loginService: LoginService) {
    router.events.subscribe((url: any) => {
      let navPart = url.url;
      if (navPart !== undefined && navPart.indexOf('?') > 0) {
        navPart = navPart.substring(0, navPart.indexOf('?'));
      }
      this.HomeNav = navPart;
    });
    this.checkLogin();
  }

  public logout() {
    this.bLogin = false;
    this.loginService.logout();
  }

  private checkLogin() {
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        this.bLogin = data.response;
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }
}
