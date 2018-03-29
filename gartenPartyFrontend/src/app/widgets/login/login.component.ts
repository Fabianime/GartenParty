import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  public gartenPartyId = '';

  private _gartenPartyId;
  private _bLogin;

  @Output() bLoginChange = new EventEmitter();

  @Input()
  get bLogin() {
    return this._bLogin;
  }

  set bLogin(val) {
    this._bLogin = val;
    this.bLoginChange.emit(this._bLogin);
  }

  constructor(private loginService: LoginService) {
  }

  public checkLogin() {
    this._gartenPartyId = this.getGartenPartyID();
    this.loginService.checkLogin(this._gartenPartyId).subscribe((data) => {
      if (data.status === 200) {
        return data.response;
      } else {
        throw data.error;
      }
    });
  }

  private getGartenPartyID() {
    const strCookies = document.cookie.split(';');
    const name = 'gartenPartyID';

    for (let i = 0; i < strCookies.length; i++) {
      let cookie = strCookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  }

  public setGartenPartyID() {
    document.cookie = 'gartenPartyID=' + this.gartenPartyId;
    console.log(document.cookie);
  }

}
