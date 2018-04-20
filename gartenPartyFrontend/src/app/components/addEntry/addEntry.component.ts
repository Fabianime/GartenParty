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
  public bLogin;

  constructor(private loginService: LoginService,
              private http: HttpClient,
              private musicService: MusicService,
              private youtubeService: YoutubeService) {
  }

  public testf = document.cookie;
  public popupHeader = 'Header';
  public popupBody = '<p>Body</p>';
  public popupFooter = 'Footer';
  public bChange = false;
  public showLoading = false;

  private _searchString;

  public selectedVideos = [];
  public listOfVideosFromYouTube = [];
  public bTest = false;

  @Output() searchStringChange = new EventEmitter();

  @Input()
  get searchString() {
    return this._searchString;
  }

  ngOnInit() {
    this.checkLogin();
  }

  set searchString(val) {
    this._searchString = val;
    this.searchStringChange.emit(this._searchString);
    this.showLoading = true;
    this.listOfVideosFromYouTube = [];

    this._searchInYoutube(val);
  }

  public getAutoComplete(searchValue: string): Observable<any> {
    // fake callback ausführen damit man keienn acces fehler bekommt
    return this.http.get('http://suggestqueries.google.com/complete/search?client=firefox&ds=ytk&q=' + searchValue);
  }

  public test() {
    this.bTest = !this.bTest;
  }

  private checkLogin() {
    // todo: auslagern nach login service
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        this.bLogin = data.response;
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
          console.log(listOfTracksToAdd);
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
        this.selectedVideos.forEach((selectedVideoData) => {
          this.popupBody += '<p style="color:black">' + selectedVideoData.name +
            '<span class="deleteVideo" (click)="deleteVideoFromSelectedList(listPoint)"> &#10006;</span></p>';
        });
        this.popupFooter = 'Footer';

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

  private _searchInYoutube(val) {
    setTimeout(() => {
      if (val === this._searchString) {
        this.youtubeService.getSearchResult(this._searchString).subscribe((data) => {
          this.showLoading = false;
          data.items.forEach((element) => {
            const tmp = {
              'title': (element.snippet.title.length > 55 ? element.snippet.title.substring(0, 52) + '...' : element.snippet.title),
              'thumbnail': element.snippet.thumbnails.medium,
              'description': element.snippet.description,
              'link': 'https://www.youtube.com/watch?v=' + element.id.videoId
            };
            this.listOfVideosFromYouTube.push(tmp);
          });
        });
      }
    }, 1000);
  }

}
