import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  private gartenPartyId;
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

  private checkLogin (){
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
         this.bLogin = data.response;
      } else {
        throw data.error
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }

  private setGartenPartyID() {
    this.createCookie('gartenPartyID',this.gartenPartyId,1);
    this.checkLogin();
  }

  private createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
        var expires = "; expires=" + date.toUTCString();
    }
    else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

}
