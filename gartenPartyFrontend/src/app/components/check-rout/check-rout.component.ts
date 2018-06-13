import { Component } from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-check-rout',
  templateUrl: './check-rout.component.html',
  styleUrls: ['./check-rout.component.scss']
})

export class CheckRoutComponent {
  private show404 = false;
  constructor(private loginService: LoginService,
              private router: Router) {
    router.events.subscribe((url: any) => {
      let navPart = url.url;
      if (navPart !== undefined && navPart.indexOf('?') > 0) {
        navPart = navPart.substring(0, navPart.indexOf('?'));
      }
      if (navPart !== undefined) {
        const oldPlaylistID = this.loginService.getGartenPartyID();
        this.setGartenPartyID(navPart.substring(1, navPart.length));
        this.checkLogin(oldPlaylistID);
      }
    });
  }

  private setGartenPartyID(playlistID) {
    this.loginService.setGartenPartyID(playlistID);
  }

  private checkLogin(oldPlaylistID) {
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        if (data.response) {
          document.location.href = '/';
          return;
        } else {
          console.log(oldPlaylistID);
          this.setGartenPartyID(oldPlaylistID);
        }
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
      this.show404 = true;
    });
  }
}
