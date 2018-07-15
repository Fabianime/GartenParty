import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class SpotifyService {

  constructor(private http: HttpClient) {

  }

  private _endpointUrlSpotify = 'https://api.spotify.com/v1/';
  private _authToken: string;
  private _authTokenTimeout: number;
  private _endpointUrlLocal = environment.apiUrl;

  initialiseToken() {
    return new Observable((observer) => {
      if (this._checkToken()) {
        observer.complete();
      }
      this._getToken().subscribe((data) => {
        if (data.status === 200) {
          const responseData = JSON.parse(data.response);
          this._authToken = responseData.access_token;
          this._authTokenTimeout = Date.now() + responseData.expires_in * 1000;
          observer.complete();
        } else {
          throw data.error;
          // toDO: return False + logs mit fehler schreiben
        }
      });
    });
  }

  private _checkToken() {
    return !(this._authToken === undefined || (this._authTokenTimeout !== undefined && this._authTokenTimeout < Date.now()));
  }

  private _getToken(): Observable<any> {
    return this.http.post(this._endpointUrlLocal + '/getSpotifyToken', {});
  }

  private _checkIfVideoAlreadyInPlaylist(playlist, videoUrl) {
    let videoInPlaylist = false;
    playlist.forEach((playlistData) => {
      if (playlistData.url === videoUrl) {
        videoInPlaylist = true;
      }
    });
    return videoInPlaylist;
  }

  private _getTracksForAlbum(albumID: string): Observable<any> {
    const header = {'headers': {'Authorization': 'Bearer ' + this._authToken}};
    return this.http.get(this._endpointUrlSpotify + 'albums/' + albumID + '/tracks?limit=50', header);
  }

  private _searchInArrayOfObjects(arrayData, checkValue, objectKey) {
    for (let i = 0; i < arrayData.length; i++) {
      if (arrayData[i][objectKey] === checkValue) {
        return i;
      }
    }
    return -1;
  }

  private _convertDuration(ms) {
    // 1- Convert to seconds:
    let seconds: number = ms / 1000;
    // 2- Extract hours:
    const hours = Math.round(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.round(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.round(seconds % 60);

    return this._getCorrectStringFromNumber(hours) + this._getCorrectStringFromNumber(minutes)
      + (seconds >= 10 ? seconds : '0' + seconds);
  }

  private _getCorrectStringFromNumber(number: number) {
    return number >= 10 ? number + ':' : number === 0 ? '' : '0' + number + ':';
  }

  private _prepTrackFromElement(element, currentPlaylist) {
    const url = element.href;
    if (!this._checkIfVideoAlreadyInPlaylist(currentPlaylist, url)) {
      const trackTitle = element.name;
      return {
        'title': (trackTitle.length > 55 ? trackTitle.substring(0, 52) + '...' : trackTitle),
        'url': element.href,
        'length': this._convertDuration(element.duration_ms)
      };
    }
    return undefined;
  }

  public getSearchResult(searchValue: string, searchFor: string): Observable<any> {
    const type = '?type=' + searchFor;
    const maxResults = searchFor === 'album' ? '&limit=10' : '&limit=50';
    const q = '&q=' + searchValue + '*';
    const header = {'headers': {'Authorization': 'Bearer ' + this._authToken}};
    return this.http.get(this._endpointUrlSpotify + 'search/' + type + maxResults + q, header);
  }

  public processTrackSearchResult(searchResult, currentPlaylist) {
    const processedData = [];

    searchResult.tracks.items.forEach((element) => {
      const albumID = element.album.id;
      const albumPosition = this._searchInArrayOfObjects(processedData, albumID, 'id');
      const trackData = this._prepTrackFromElement(element, currentPlaylist);
      if (trackData !== undefined) {
        if (albumPosition === -1) {
          const albumData = {
            'thumbnail': element.album.images[1],
            'id': albumID,
            'name': element.album.name,
            'releaseDate': element.album.release_date.substring(0, 4),
            'tracks': [trackData]
          };
          processedData.push(albumData);
        } else {
          processedData[albumPosition].tracks.push(trackData);
        }
      }
    });
    return processedData;
  }

  public processAlbumSearchResult(searchResult, currentPlaylist): Observable<Array<any>> {
    return new Observable((observer) => {
      const processedData = [];
      let checkSum = searchResult.albums.items.length;
      searchResult.albums.items.forEach((element) => {
        const albumData = {
          'thumbnail': element.images[1],
          'id': element.id,
          'name': element.name,
          'releaseDate': element.release_date.substring(0, 4),
          'tracks': []
        };
        this._getTracksForAlbum(element.id).subscribe((data) => {
          data.items.forEach((trackData) => {
            const formatedTrackData = this._prepTrackFromElement(trackData, currentPlaylist);
            if (formatedTrackData !== undefined) {
              albumData.tracks.push(formatedTrackData);
            }
          });
          if (albumData.tracks.length > 0) {
            processedData.push(albumData);
          } else {
            checkSum -= 1;
          }
        });
      });
      Observable.interval(200)
        .takeWhile(() => processedData.length === checkSum)
        .subscribe(() => {
          observer.next(processedData);
          observer.complete();
        });
    });
  }
}
