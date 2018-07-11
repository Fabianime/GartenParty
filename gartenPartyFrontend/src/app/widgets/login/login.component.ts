import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  public gartenPartyId;
  public loginInvalide;

  @Output() bLoginChange = new EventEmitter();

  constructor(private loginService: LoginService) {
  }

  public checkLogin() {
    this.loginService.setGartenPartyID(this.gartenPartyId);
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        if (data.response === true) {
          location.reload();
        } else {
          this.loginInvalide = true;
        }
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }

}
