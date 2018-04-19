import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval'; 
import 'rxjs/add/operator/takeWhile';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit
 {

  constructor(
    private musicService: MusicService, 
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.checkLogin();
    this.getPlayList();
  }  

  public ngAfterViewInit (): void {
    console.log('load');
    this.getCurrentTrackFromServer();
  } 

  public playlist = [];

  private _currentTrack;

  private set_CurrentTrack(val) {
    this._currentTrack = val;
    this.handleProgressBar();
  }

  public bError = false;
  public bLogin = false;

  public mode = 'determinate';
  public value = 100;

  public trackTimePalyed = '0:00';
  public trackLength = '0:00';
  public trackName = '';
  public trackLengthMs = 0;

  private _gartenPartyID = this.loginService.getGartenPartyID();
  private _checkPlayLength = false;

  private getPlayList() {
    this.musicService.getPlayList(this._gartenPartyID).subscribe((data) => {
      if (data.status === 200) {
        const strData = JSON.parse(data.response);
        this.playlist = strData.playlist;
      } else {
        this.bError = true;
      }
    });
  }

  private getCurrentTrackFromServer() {
    this.musicService.getCurrentTrack(this._gartenPartyID).subscribe((data) => {
      if (data.status === 200) {
        this.getActualCurrentTrack(JSON.parse(data.response), true);
      } else {
        this.bError = true;
      }
    });
  }

  private getActualCurrentTrack(trackFromServer, checkFirstTime = false) {
    const timeDifferenceInMilliseconds = new Date().getTime() - new Date(trackFromServer.start).getTime();    
    const timeDifferenceAsDate = new Date(timeDifferenceInMilliseconds);
    
    let trackPositionInPlaylist = trackFromServer.playlistPosition -1;
    let trackLengthAsArray = this.playlist[trackPositionInPlaylist].length.split(':');
    let trackLengthAsDate = new Date(trackLengthAsArray[0] * 60000  + trackLengthAsArray[1] * 1000);
    let timeToAdd = [0,0];

    let checkTrackLength = false;

    while(!checkTrackLength){
      if(timeDifferenceAsDate > trackLengthAsDate) {
        trackPositionInPlaylist++;

        if(trackPositionInPlaylist >= this.playlist.length){
          trackPositionInPlaylist = 0;
        }
        timeToAdd[0] += parseInt(trackLengthAsArray[0]);
        timeToAdd[1] += parseInt(trackLengthAsArray[1]);

        trackLengthAsArray = this.playlist[trackPositionInPlaylist].length.split(':');

        trackLengthAsDate = this.addMinutes(trackLengthAsDate,parseInt(trackLengthAsArray[0]));
        trackLengthAsDate = this.addSeconds(trackLengthAsDate,parseInt(trackLengthAsArray[1]));

      } else {
        checkTrackLength = true;
        trackFromServer.start = new Date(trackFromServer.start);
        
        trackFromServer.start = this.addMinutes(trackFromServer.start,timeToAdd[0]);
        trackFromServer.start = this.addSeconds(trackFromServer.start,timeToAdd[1]);
        trackFromServer.playlistPosition = trackPositionInPlaylist + 1;

      }
    }
    this.trackName = this.playlist[trackFromServer.playlistPosition - 1].name;
    if(checkFirstTime){
      this.set_CurrentTrack(trackFromServer);
    }else{
      this._currentTrack = trackFromServer;
    }
    
  }

  private handleProgressBar (){
    if(this._currentTrack !== undefined){
      this.setTrackLength(this.playlist[this._currentTrack.playlistPosition - 1].length);
      let i = 0;
        Observable.interval(200)
        .takeWhile(() => !this._checkPlayLength)
        .subscribe(i => { 
          const timeDifferenceInMilliseconds = Math.abs(new Date().getTime() - new Date(this._currentTrack.start).getTime());
          const timeDifferenceAsDate = new Date(timeDifferenceInMilliseconds);

          const trackTimePalyedMin = timeDifferenceAsDate.getMinutes();
          const trackTimePalyedSec = timeDifferenceAsDate.getSeconds();
          let trackTimePalyedSecDisplayed = trackTimePalyedSec.toString();
          if(trackTimePalyedSec < 10){
            trackTimePalyedSecDisplayed = '0' + trackTimePalyedSec;
          }

          this.trackTimePalyed =  trackTimePalyedMin + ':' + trackTimePalyedSecDisplayed;
          const trackTimePalyedMs = trackTimePalyedMin * 60000 + trackTimePalyedSec * 1000;

          this.value = this.precisionRound(trackTimePalyedMs/this.trackLengthMs*100,4);
          if(timeDifferenceInMilliseconds > this.trackLengthMs){
            this.getActualCurrentTrack(this._currentTrack);
            this.setTrackLength(this.playlist[this._currentTrack.playlistPosition - 1].length);
          }

        });
    } else {
      console.log(this._currentTrack);
    }
  }

  private addMinutes (date: Date,minutes){
      date.setMinutes(date.getMinutes() + minutes);
      return date;
  }

  private addSeconds (date: Date,seconds){
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

  private setTrackLength (trackLength){
    this.trackLength = trackLength;
    const trackLengthSplited = this.trackLength.split(':');
    this.trackLengthMs = parseInt(trackLengthSplited[0]) * 60000 + parseInt(trackLengthSplited[1]) * 1000;
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
