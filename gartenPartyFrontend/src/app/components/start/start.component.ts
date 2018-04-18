import {Component, OnInit} from '@angular/core';
import {MusicService} from '../../services/music.service';
import {LoginService} from '../../services/login.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(private musicService: MusicService,
              private loginService: LoginService) {
  }

  public aPlaylist = [];
  public bError = false;

  public bLogin = false;

  ngOnInit() {
    this.getPlayList();
    this.checkLogin();
  }

  private getPlayList() {
    this.musicService.getPlayList('1').subscribe((data) => {
      if (data.status === 200) {
        const strData = JSON.parse(data.response);
        this.aPlaylist = strData.playlist;
        console.log(this.aPlaylist);
      } else {
        this.bError = true;
      }
    });
  }

  public addEntryRedirect() {
    document.location.href = '/addEntry';
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
