import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';


@Component({
  selector: 'app-addentry',
  templateUrl: './addEntry.component.html',
  styleUrls: ['./addEntry.component.scss']
})
export class AddEntryComponent implements OnInit {
  public bLogin;
  constructor(private loginService: LoginService) {
  }

  public test = document.cookie;

  ngOnInit() {
    this.checkLogin();
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
}
