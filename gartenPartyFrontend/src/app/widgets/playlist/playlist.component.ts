import {Component, OnInit, EventEmitter, AfterViewInit} from '@angular/core';
import {MusicService} from '../../services/music.service';
import {LoginService} from '../../services/login.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, AfterViewInit {
  public playlist = [];

  private _startTrack;

  public bError = false;
  public bLogin = false;

  public playlistImg: string;
  public playlistDescription: string;
  public value = 100;

  public trackTimePalyed = '0:00';
  public trackLength = '0:00';
  public trackName = '';
  public trackLengthMs = 0;

  private _gartenPartyID = this.loginService.getGartenPartyID();
  private _checkPlayLength = false;

  constructor(private musicService: MusicService,
              private loginService: LoginService) {
  }

  ngOnInit() {
    this.checkLogin();
    this.getPlayList();
  }

  public ngAfterViewInit(): void {
    this.getStartTrackFromServer();
  }

  private set_StartTrack(val) {
    this._startTrack = val;
    this.handleProgressBar();
  }

  private getPlayList() {
    // this is tmp
    // AK'14 ! ➡ Walk of fame. Die Stars gehen – die Fans bleiben. Mit dem Zeugnis in den Händen werden Helden zu Legenden.
    if (this._gartenPartyID === '839') {
      this.playlistImg = 'assets/839.jpg';
      this.playlistDescription = 'Beim Auftreten von Fehlern, meldet euch bei mir (Fabi)';
    } else if (this._gartenPartyID === 'AK14') {
      this.playlistImg = 'assets/ak14.jpg';
      this.playlistDescription = 'AK\'14 ! ➡ Walk of fame. Die Stars gehen – die Fans bleiben.' +
        ' Mit dem Zeugnis in den Händen werden Helden zu Legenden.';
    } else {
      this.playlistImg = 'https://target.scene7.com/is/image/Target/51223401?wid=520&amp;hei=520&amp;fmt=pjpeg';
      this.playlistDescription = 'Please have mercy.';
    }
    // tmp end

    this.musicService.getPlayList(this._gartenPartyID).subscribe((data) => {
      if (data.status === 200) {
        const strData = JSON.parse(data.response);
        this.playlist = strData.playlist;
      } else {
        this.bError = true;
      }
    });
  }

  private getStartTrackFromServer() {
    this.musicService.getStartTrack(this._gartenPartyID).subscribe((data) => {
      if (data.status === 200) {
        this.getCurrentTrack(JSON.parse(data.response));
      } else {
        this.bError = true;
      }
    });
  }

  private getCurrentTrack(trackFromServer) {
    const timeDifferenceInMilliseconds = new Date().getTime() - new Date(trackFromServer.start).getTime();
    const timeDifferenceAsDate = new Date(timeDifferenceInMilliseconds);

    let trackPositionInPlaylist = trackFromServer.playlistPosition - 1;
    let trackLengthAsArray = this.playlist[trackPositionInPlaylist].length.split(':');
    let trackLengthAsDate = new Date(trackLengthAsArray[0] * 60000 + trackLengthAsArray[1] * 1000);
    const timeToAdd = [0, 0];

    while (timeDifferenceAsDate > trackLengthAsDate) {
      trackPositionInPlaylist++;

      if (trackPositionInPlaylist >= this.playlist.length) {
        trackPositionInPlaylist = 0;
      }
      // parseInt needs Radix https://stackoverflow.com/questions/7818903/jslint-says-missing-radix-parameter-what-should-i-do
      timeToAdd[0] += parseInt(trackLengthAsArray[0], 10);
      timeToAdd[1] += parseInt(trackLengthAsArray[1], 10);

      trackLengthAsArray = this.playlist[trackPositionInPlaylist].length.split(':');
      trackLengthAsDate = this.addMinutes(trackLengthAsDate, parseInt(trackLengthAsArray[0], 10));
      trackLengthAsDate = this.addSeconds(trackLengthAsDate, parseInt(trackLengthAsArray[1], 10));
    }
    trackFromServer = this.updateTrackFromServer(trackFromServer, timeToAdd, trackPositionInPlaylist);
    this.trackName = this.playlist[trackFromServer.playlistPosition - 1].name;
    this.set_StartTrack(trackFromServer);

  }

  private handleProgressBar() {
    if (this._startTrack !== undefined) {
      this.setTrackLength(this.playlist[this._startTrack.playlistPosition - 1].length);
      Observable.interval(200)
        .takeWhile(() => !this._checkPlayLength)
        .subscribe(i => {
          const timeDifferenceInMilliseconds = Math.abs(new Date().getTime() - new Date(this._startTrack.start).getTime());
          const timeDifferenceAsDate = new Date(timeDifferenceInMilliseconds);

          const trackTimePalyedMin = timeDifferenceAsDate.getMinutes();
          const trackTimePalyedSec = timeDifferenceAsDate.getSeconds();
          let trackTimePalyedSecDisplayed = trackTimePalyedSec.toString();
          if (trackTimePalyedSec < 10) {
            trackTimePalyedSecDisplayed = '0' + trackTimePalyedSec;
          }

          this.trackTimePalyed = trackTimePalyedMin + ':' + trackTimePalyedSecDisplayed;
          const trackTimePalyedMs = trackTimePalyedMin * 60000 + trackTimePalyedSec * 1000;

          this.value = this.precisionRound(trackTimePalyedMs / this.trackLengthMs * 100, 4);
          if (timeDifferenceInMilliseconds > this.trackLengthMs) {
            this.getCurrentTrack(this._startTrack);
            this.setTrackLength(this.playlist[this._startTrack.playlistPosition - 1].length);
          }

        });
    } else {
      console.log(this._startTrack);
    }
  }

  private setTrackLength(trackLength) {
    this.trackLength = trackLength;
    const trackLengthSplited = this.trackLength.split(':');
    this.trackLengthMs = parseInt(trackLengthSplited[0], 10) * 60000 + parseInt(trackLengthSplited[1], 10) * 1000;
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

  private updateTrackFromServer(trackFromServer, timeToAdd, trackPositionInPlaylist) {
    const returnObject = {'start': new Date(trackFromServer.start), 'playlistPosition': trackPositionInPlaylist + 1};
    returnObject.start = this.addMinutes(returnObject.start, timeToAdd[0]);
    returnObject.start = this.addSeconds(returnObject.start, timeToAdd[1]);
    return returnObject;
  }

  private addMinutes(date: Date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  private addSeconds(date: Date, seconds) {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  }

  private precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  public addEntryRedirect() {
    document.location.href = '/addEntry';
  }
}
