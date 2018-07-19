import {Component, OnInit, EventEmitter, Input, Output, ElementRef, ViewChild} from '@angular/core';
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
  @ViewChild('hideKeyboard') hideKeyboard: ElementRef;

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
  public showLogin = false;
  public showAddEntry = false;
  public selectedVideos = [];
  public listOfVideosFromAPI = [];
  public showResults = false;
  public spinnerDisplay = false;
  public spotifySearchType = 'artist';
  public searchEngine: string;
  public spotifyOffset: number;
  public artistID: string;

  private _searchString;
  private _playlistID = this.loginService.getGartenPartyID();
  private _playlist = [];
  private _oldSelectedVideos = [];

  @Output() searchStringChange = new EventEmitter();

  @Input()
  get searchString() {
    return this._searchString;
  }

  set searchString(val) {
    this._searchString = val;
    this.searchStringChange.emit(this._searchString);
    this.spinnerDisplay = true;
    this.listOfVideosFromAPI = [];
    if (this._searchString.length) {
      setTimeout(() => {
        if (this._searchString === val) {
          this._searchInEngine();
        }
      }, 800);
    } else {
      this.spinnerDisplay = false;
    }
  }

  ngOnInit() {
    this._checkLogin();
    this._getPlayList();
    this.spotifyService.initialiseToken()
      .subscribe(
        () => {
        },
        () => {
        },
        () => {
        }
      );
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

  private _getPlayList() {
    this.musicService.getPlayList(this._playlistID)
      .subscribe((data) => {
          const strData = JSON.parse(data.response);
          if (strData.playlist === undefined) {
            this._playlist = [];
          } else {
            this._playlist = strData.playlist;
          }
        },
        () => {
        },
        () => {
        }
      );
  }

  private _checkLogin() {
    // todo: auslagern nach login service
    this.loginService.checkGartenPartyID()
      .subscribe((data) => {
          if (data.status === 200) {
            this.showLogin = !data.response;
            this.showAddEntry = data.response;
          } else {
            throw data.error;
            // toDO: return False + logs mit fehler schreiben
          }
        },
        () => {
        },
        () => {
        }
      );
  }

  private _checkShowResult() {
    switch (this.searchEngine) {
      case 'YouTube':
        return !this.showResults;
      case 'Spotify':
        return this.spotifySearchType ? !this.showResults : this.spotifySearchType.length > 0;
      default:
        return false;
    }
  }

  private _searchInEngine() {
    if (this._searchString) {
      this.hideKeyboard.nativeElement.focus();
      this.hideKeyboard.nativeElement.blur();
      switch (this.searchEngine) {
        case 'YouTube':
          this._searchInYoutube();
          break;
        case 'Spotify':
          if (this.spotifySearchType) {
            this._searchInSpotify();
          }
          break;
      }
    }
  }

  public loadSearchEngine(searchEngine) {
    if (this.searchEngine !== searchEngine) {
      this.showResults = false;
      this.searchEngine = searchEngine;
    } else {
      this.searchEngine = '';
    }
    this.showResults = this._checkShowResult();
    this.listOfVideosFromAPI = [];
    this._searchInEngine();
  }

  private _searchInYoutube(nextPageToken?: string) {
    this.spinnerDisplay = true;
    this.youtubeService.getSearchResult(this._searchString, nextPageToken)
      .subscribe((data) => {
          this.listOfVideosFromAPI = this.listOfVideosFromAPI.concat(
            this.youtubeService.processSearchResult(data, this._playlist, this.listOfVideosFromAPI.length));
          if (this.listOfVideosFromAPI.length < 20) {
            this._searchInYoutube(data.nextPageToken);
          } else {
            this.spinnerDisplay = false;
          }
        },
        () => {
        },
        () => {
        })
    ;
  }

  private _searchInSpotify() {
    this.spinnerDisplay = true;
    this.spotifyService.getSearchResult(this._searchString, this.spotifySearchType)
      .subscribe((data) => {
          switch (this.spotifySearchType) {
            case 'album':
              this.spotifyService.processAlbumSearchResult(data, this._playlist)
                .subscribe((processedData) => {
                    this.listOfVideosFromAPI = processedData;
                  },
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    this.spinnerDisplay = false;
                  });
              break;
            case 'artist':
              this.spotifyService.processArtistSearchResult(data)
                .subscribe((processedData) => {
                    this.listOfVideosFromAPI = processedData;
                    this.spinnerDisplay = false;
                  },
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    this.spinnerDisplay = false;
                  });
              break;
            case 'track':
              this.listOfVideosFromAPI = this.spotifyService.processTrackSearchResult(data, this._playlist);
              this.spinnerDisplay = false;
              break;
            default:
              break;
          }
        },
        () => {
        },
        () => {
        }
      );
  }

  public onSpotifySearchTypeChange(searchType) {
    this.listOfVideosFromAPI = [];
    this.artistID = '';
    this.spotifySearchType = searchType;
    this.showResults = this.spotifySearchType.length > 0;
    this._searchInEngine();
  }

  public getAlbumsWithTracksFromArtist(artistID: string, offset = 0) {
    this.artistID = artistID;
    this.spotifyOffset = offset;
    this.spinnerDisplay = true;
    this.spotifyService.getAlbumsWithTracksFromArtist(artistID, offset, this._playlist)
      .subscribe((processedData) => {
          this.listOfVideosFromAPI = offset > 0 ? this.listOfVideosFromAPI.concat(processedData) : processedData;
          console.log(this.listOfVideosFromAPI);
          this.spotifySearchType = 'album';
        },
        () => {
        },
        () => {
          this.spinnerDisplay = false;
        });
  }

  // ToDO: improve me?
  private addTracksToPlayList(listOfTracksToAdd) {
    const playlistID = this.loginService.getGartenPartyID();
    this.musicService.setPlayList(playlistID, listOfTracksToAdd)
      .subscribe((responseData) => {
          if (responseData.status === 200) {
            this.popupHeader = 'You added: ' + listOfTracksToAdd.length + ' videos';
            this.popupBody = '';
            this.popupBodyData = [];
            listOfTracksToAdd.forEach((selectedVideoData, index) => {
              this.popupBody += '<p style="color:black">' + selectedVideoData.name +
                '<span class="deleteVideo" (click)="this.closePopup(listPoint)"> &#10006;</span></p>';
              this.popupBodyData.push({'value': selectedVideoData.name, 'id': index});
            });
            this.popupFooter = 'Footer';
            this.showPopup = true;

            this._oldSelectedVideos = this.selectedVideos;
            this.selectedVideos = [];
            this.listOfVideosFromAPI = [];
            this._searchString = '';
            this.loadSearchEngine('');
            this._getPlayList();
          } else {
            throw responseData.error;
            // toDO: return False + logs mit fehler schreiben
          }
        },
        () => {
        },
        () => {
        });
  }

  // ToDO: improve me?
  public addSelectedToList() {
    // hier noch besseres selected Videos array erstelen
    const listOfTracksToAdd = [];
    this.selectedVideos.forEach((videoData) => {
      if (videoData.url.indexOf('https://www.youtube.com/watch?v=') >= 0) {
        const videoId = videoData.url.replace('https://www.youtube.com/watch?v=', '');
        this.youtubeService.getContentDetailsOfTrack(videoId)
          .subscribe((data) => {
              const length = this._convertDuration(data.items[0].contentDetails.duration);
              const tmp = {
                'name': videoData.name,
                'url': videoData.url,
                'length': length
              };
              listOfTracksToAdd.push(tmp);
            },
            () => {
            },
            () => {
            });
      } else {
        listOfTracksToAdd.push(videoData);
      }
    });
    // TODO: muss noch zu bulk upload oder so
    const waitingForDataSubscription = Observable.interval(200)
      .takeWhile(() => listOfTracksToAdd.length === this.selectedVideos.length)
      .subscribe(() => {
          this.addTracksToPlayList(listOfTracksToAdd);
          waitingForDataSubscription.unsubscribe();
        },
        () => {
        },
        () => {
        });
  }

  // ToDO: improve me? Bulk?
  public deleteTrack(val: number) {
    this.popupBodyData.forEach((videoData, index) => {
      if (videoData.id === val) {
        this.popupBodyData.splice(index, 1);
      }
    });
    this.musicService.deleteTrack(this._playlistID, this._oldSelectedVideos[val].url)
      .subscribe((data) => {
          if (data.status === 200) {
            // ToDo: do something maybe?
          } else {
            // ToDo: log error
          }
        },
        () => {
        },
        () => {
        });
  }
}
