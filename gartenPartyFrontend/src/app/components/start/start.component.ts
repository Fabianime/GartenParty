import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  public showLogin = false;
  public showPlaylist = false;

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
    this.checkLogin();
  }

  private checkLogin() {
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        this.showLogin = !data.response;
        this.showPlaylist = data.response;
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }
}
