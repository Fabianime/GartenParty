import {Component, OnInit} from '@angular/core';
import {MusicService} from '../../services/music.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(private musicService: MusicService) {
  }

  public aPlaylist = [];
  public bError = false;

  ngOnInit() {
    this.getPlayList();
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
}
