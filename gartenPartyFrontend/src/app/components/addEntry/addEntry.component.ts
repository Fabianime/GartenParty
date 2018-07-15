import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {MusicService} from '../../services/music.service';
import {YoutubeService} from '../../services/youtube.service';
import {SpotifyService} from '../../services/spotify.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './addEntry.component.html',
  styleUrls: ['./addEntry.component.scss']
})
export class AddEntryComponent implements OnInit {

  constructor(private loginService: LoginService,
              private http: HttpClient,
              private musicService: MusicService,
              private youtubeService: YoutubeService,
              private spotifyService: SpotifyService,
  ) {
  }

  public popupHeader = 'Header';
  public popupBody = '<p>Body</p>';
  public popupBodyData = new Array({'value': '', 'id': 0});
  public popupFooter = 'Footer';

  public showPopup = false;
  public youtubeIsSelected = false;
  public spotifyIsSelected = false;
  public showLogin = false;
  public showAddEntry = false;
  public selectedVideos = [];
  public listOfVideosFromYouTube = [];
  public listOfVideosFromSpotify = [];
  public showResults = false;
  public spinnerDisplay = false;
  public spotifySearchFor = '';

  private _searchString;
  private _playlistID = this.loginService.getGartenPartyID();
  private _playlist = [];
  private _listOfVideosFromYouTubeOverload = [];
  private _oldSelectedVideos = [];
  private _searchEngine: string;

  @Output() searchStringChange = new EventEmitter();

  @Input()
  get searchString() {
    return this._searchString;
  }

  set searchString(val) {
    this._searchString = val;
    this.searchStringChange.emit(this._searchString);
    this.spinnerDisplay = true;
    this.listOfVideosFromYouTube = [];
    this._listOfVideosFromYouTubeOverload = [];
    if (this._searchString.length) {
      setTimeout(() => {
        if (this._searchString === val) {
          if (this._searchEngine === 'YouTube') {
            this._searchInYoutube();
          } else if (this._searchEngine === 'Spotify') {
            this._searchInSpotify();
          }
        }
      }, 1000);
    } else {
      this.spinnerDisplay = false;
    }
  }

  ngOnInit() {
    this.checkLogin();
    this._getPlayList();
    this.spotifyService.initialiseToken().subscribe();
  }

  private _getPlayList() {
    this.musicService.getPlayList(this._playlistID).subscribe((data) => {
      const strData = JSON.parse(data.response);
      if (strData.playlist === undefined) {
        this._playlist = [];
      } else {
        this._playlist = strData.playlist;
      }
    });
  }

  private checkLogin() {
    // todo: auslagern nach login service
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        this.showLogin = !data.response;
        this.showAddEntry = data.response;
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }

  private addTracksToPlayList(listOfTracksToAdd) {
    const playlistID = this.loginService.getGartenPartyID();
    this.musicService.setPlayList(playlistID, listOfTracksToAdd).subscribe((responseData) => {
      if (responseData.status === 200) {
        this.showPopup = true;
        this.popupHeader = 'You added: ' + this.selectedVideos.length + ' videos';
        this.popupBody = '';
        this.popupBodyData = [];

        this.selectedVideos.forEach((selectedVideoData, index) => {
          this.popupBody += '<p style="color:black">' + selectedVideoData.name +
            '<span class="deleteVideo" (click)="this.closePopup(listPoint)"> &#10006;</span></p>';
          this.popupBodyData.push({'value': selectedVideoData.name, 'id': index});
        });
        this.popupFooter = 'Footer';

        this._oldSelectedVideos = this.selectedVideos;
        this.selectedVideos = [];
        this.listOfVideosFromYouTube = [];
        this._searchString = '';
        this._getPlayList();
      } else {
        throw responseData.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }

  public addSelectedToList() {
    // hier noch besseres selected Videos array erstelen
    const listOfTracksToAdd = [];
    this.selectedVideos.forEach((videoData) => {
      if (videoData.url.indexOf('https://www.youtube.com/watch?v=') >= 0) {
        const videoId = videoData.url.replace('https://www.youtube.com/watch?v=', '');
        this.youtubeService.getContentDetailsOfTrack(videoId).subscribe((data) => {
          const length = this._convertDuration(data.items[0].contentDetails.duration);
          const tmp = {
            'name': videoData.name,
            'url': videoData.url,
            'length': length
          };
          listOfTracksToAdd.push(tmp);
        });
      } else {
        listOfTracksToAdd.push(videoData);
      }
    });
    // TODO: muss noch zu bulk upload oder so
    Observable.interval(200)
      .takeWhile(() => listOfTracksToAdd.length === this.selectedVideos.length)
      .subscribe(() => {
        this.addTracksToPlayList(listOfTracksToAdd);
      });
  }

  private _convertDuration(duration): string {
    const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0, minutes = 0, seconds = 0;
    let returnString = '';

    if (reptms.test(duration)) {
      const matches = reptms.exec(duration);
      if (matches[1]) {
        hours = Number(matches[1]);
        returnString += hours < 10 ? '0' + hours : hours;
        returnString += ':';
      }
      if (matches[2]) {
        minutes = Number(matches[2]);
        returnString += minutes < 10 ? '0' + minutes : minutes;
        returnString += ':';
      } else {
        returnString += '00:';
      }
      if (matches[3]) {
        seconds = Number(matches[3]);
        returnString += seconds < 10 ? '0' + seconds : seconds;
      } else {
        returnString += '00';
      }
      return returnString;
    }
  }

  public deleteTrack(val: number) {
    this.popupBodyData.forEach((videoData, index) => {
      if (videoData.id === val) {
        this.popupBodyData.splice(index, 1);
      }
    });
    this.musicService.deleteTrack(this._playlistID, this._oldSelectedVideos[val].url).subscribe((data) => {
      if (data.status === 200) {
        // ToDo: do something maybe?
      } else {
        // ToDo: log error
      }
    });
  }

  // SearchEngine Specific Functions

  public loadYoutube() {
    if (this._searchEngine === 'YouTube') {
      this.showResults = !this.showResults;
    } else {
      this.showResults = true;
    }
    this._searchEngine = 'YouTube';
    this.youtubeIsSelected = !this.youtubeIsSelected;
    this.spotifyIsSelected = false;
    this.listOfVideosFromYouTube = [];
    this.listOfVideosFromSpotify = [];
    if (this._searchString !== undefined && this._searchString !== '') {
      this._searchInYoutube();
    }
  }

  private _searchInYoutube(nextPageToken?: string) {
    this.spinnerDisplay = true;
    this.youtubeService.getSearchResult(this._searchString, nextPageToken).subscribe((data) => {
      const processedSearchData = this.youtubeService.processSearchResult(data, this._playlist, this.listOfVideosFromYouTube.length);
      this.listOfVideosFromYouTube = this.listOfVideosFromYouTube.concat(processedSearchData);

      if (this.listOfVideosFromYouTube.length < 20) {
        this._searchInYoutube(data.nextPageToken);
      } else {
        this.spinnerDisplay = false;
      }
    });
  }

  public loadSpotify() {
    if (this._searchEngine === 'Spotify' && this.spotifySearchFor.length) {
      this.showResults = !this.showResults;
    } else {
      this._toggleSpotifySearchBar();
    }
    this.spotifyIsSelected = !this.spotifyIsSelected;
    this._searchEngine = 'Spotify';
    this.youtubeIsSelected = false;
    this.listOfVideosFromYouTube = [];
    this.spotifyService.initialiseToken().subscribe();
    this._searchInSpotify();
  }

  public searchForChangeSpotify() {
    this._toggleSpotifySearchBar();
    this._searchInSpotify();
  }

  private _toggleSpotifySearchBar() {
    this.showResults = this.spotifySearchFor.length > 0;
  }

  private _searchInSpotify() {
    if (this._searchString !== undefined && this._searchString !== '' && this.spotifySearchFor.length > 0) {
      this.spinnerDisplay = true;
      this.listOfVideosFromSpotify = [];
      this.spotifyService.getSearchResult(this._searchString, this.spotifySearchFor).subscribe((data) => {
        if (this.spotifySearchFor === 'track') {
          this.listOfVideosFromSpotify = this.spotifyService.processTrackSearchResult(data, this._playlist);
          this.spinnerDisplay = false;
        } else if (this.spotifySearchFor === 'album') {
          this.spotifyService.processAlbumSearchResult(data, this._playlist).subscribe((processedData) => {
            this.listOfVideosFromSpotify = processedData;
            this.spinnerDisplay = false;
          });
        }
      });
    }
  }
}
