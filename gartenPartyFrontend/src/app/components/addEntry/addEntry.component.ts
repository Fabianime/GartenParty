import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {MusicService} from '../../services/music.service';
import {YoutubeService} from '../../services/youtube.service';

@Component({
  selector: 'app-addentry',
  templateUrl: './addEntry.component.html',
  styleUrls: ['./addEntry.component.scss']
})
export class AddEntryComponent implements OnInit {

  constructor(private loginService: LoginService,
              private http: HttpClient,
              private musicService: MusicService,
              private youtubeService: YoutubeService) {
  }

  public popupHeader = 'Header';
  public popupBody = '<p>Body</p>';
  public popupBodyData = new Array({'value': '', 'id': 0});
  public popupFooter = 'Footer';
  public bChange = false;
  public showLoading = false;
  public youtubeIsSelected = false;
  public showLogin = false;
  public showAddEntry = false;

  private _searchString;
  private _gartenPartyID = this.loginService.getGartenPartyID();
  private _playlist = [];
  private _nextPageToken: string;
  private _listOfVideosFromYouTubeOverload = [];
  private _oldSelectedVideos = [];

  public selectedVideos = [];
  public listOfVideosFromYouTube = [];
  public showResults = false;
  public spinnerDisplay = false;

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
          this._searchInYoutube();
        }
      }, 1000);
    } else {
      this.spinnerDisplay = false;
    }
  }

  ngOnInit() {
    this.checkLogin();
    this._getPlayList();
  }

  public getAutoComplete(searchValue: string): Observable<any> {
    // fake callback ausführen damit man keienn acces fehler bekommt
    return this.http.get('http://suggestqueries.google.com/complete/search?client=firefox&ds=ytk&q=' + searchValue);
  }

  public loadYoutube() {
    this.showResults = !this.showResults;
    this.youtubeIsSelected = !this.youtubeIsSelected;
    this.listOfVideosFromYouTube = [];
    console.log(this._searchString !== '');
    if (this._searchString !== undefined && this._searchString !== '') {
      this._searchInYoutube();
    }
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

  public addSelectedToList() {
    // hier noch bessees selected Videos array erstelen
    const listOfTracksToAdd = [];
    this.selectedVideos.forEach((videoData) => {
      const startPositionOfId = videoData.link.search('watch') + 8;
      const videoId = videoData.link.substring(startPositionOfId);
      let length = '0';
      this.youtubeService.getContentDetailsOfTrack(videoId).subscribe((data) => {
        length = this._convertDuration(data.items[0].contentDetails.duration);

        const tmp = {
          'name': videoData.name,
          'url': videoData.link,
          'length': length
        };

        listOfTracksToAdd.push(tmp);
        // TODO: muss noch zu bulk upload oder so
        if (listOfTracksToAdd.length === this.selectedVideos.length) {
          this.addTracksToPlayList(listOfTracksToAdd);
        }
      });
    });
  }

  private addTracksToPlayList(listOfTracksToAdd) {
    const gartenPartyId = this.loginService.getGartenPartyID();
    this.musicService.setPlayList(gartenPartyId, listOfTracksToAdd).subscribe((responseData) => {
      if (responseData.status === 200) {
        this.bChange = true;
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
      } else {
        throw responseData.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }

  private _convertDuration(duration) {
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

  private _searchInYoutube(nextPageToken?: string) {
    this.youtubeService.getSearchResult(this._searchString, nextPageToken).subscribe((data) => {
      this._nextPageToken = data.nextPageToken;
      this.spinnerDisplay = false;
      data.items.forEach((element) => {
        const tmp = {
          'title': (element.snippet.title.length > 55 ? element.snippet.title.substring(0, 52) + '...' : element.snippet.title),
          'thumbnail': element.snippet.thumbnails.medium,
          'description': element.snippet.description,
          'link': 'https://www.youtube.com/watch?v=' + element.id.videoId
        };
        if (!this._checkIfVideoAlreadyInPlaylist(tmp.link)) {
          if (this.listOfVideosFromYouTube.length >= 25) {
            this.listOfVideosFromYouTube.push(tmp);
          } else {
            this._listOfVideosFromYouTubeOverload.push(tmp);
          }
        }
      });
      this._listOfVideosFromYouTubeOverload.forEach((videoData) => {
        if (this.listOfVideosFromYouTube.length < 25) {
          this.listOfVideosFromYouTube.push(videoData);
          this._listOfVideosFromYouTubeOverload.splice(0, 1);
        }
      });
      if (this.listOfVideosFromYouTube.length < 20) {
        this._searchInYoutube(this._nextPageToken);
      }
    });
  }

  private _checkIfVideoAlreadyInPlaylist(videoUrlToCheck: string) {
    let videoInPlaylist = false;
    this._playlist.forEach((playlistData) => {
      if (playlistData.url === videoUrlToCheck) {
        videoInPlaylist = true;
      }
    });
    return videoInPlaylist;
  }

  private _getPlayList() {
    this.musicService.getPlayList(this._gartenPartyID).subscribe((data) => {
      const strData = JSON.parse(data.response);
      if (strData.playlist === undefined) {
        this._playlist = [];
      } else {
        this._playlist = strData.playlist;
      }
    });
  }

  public deleteTrack(val: number) {
    this.popupBodyData.forEach((videoData, index) => {
      if (videoData.id === val) {
        this.popupBodyData.splice(index, 1);
      }
    });
    this.musicService.deleteTrack(this._gartenPartyID, this._oldSelectedVideos[val].link).subscribe((data) => {
      if (data.status === 200) {
        // ToDo: do something mabe?
      } else {
        // ToDo: log error
      }
    });
  }

}

