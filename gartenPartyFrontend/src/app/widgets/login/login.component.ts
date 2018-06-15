import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  public gartenPartyId;
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

  public setGartenPartyID() {
    this.loginService.setGartenPartyID(this.gartenPartyId);
    this.checkLogin();
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
