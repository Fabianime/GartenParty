import {EventEmitter, Injectable} from '@angular/core';
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
        return;
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
        return;
      });
    });
  }

  private _checkToken() {
    return !(this._authToken === undefined || (this._authTokenTimeout !== undefined && this._authTokenTimeout < Date.now()));
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

  private _getToken(): Observable<any> {
    return this.http.post(this._endpointUrlLocal + '/getSpotifyToken', {});
  }

  private _getTracksForAlbum(albumID: string): Observable<any> {
    const header = {'headers': {'Authorization': 'Bearer ' + this._authToken}};
    return this.http.get(this._endpointUrlSpotify + 'albums/' + albumID + '/tracks?limit=50', header);
  }

  private _getAlbumsFromArtist(artistID: string, offset): Observable<any> {
    const header = {'headers': {'Authorization': 'Bearer ' + this._authToken}};
    return this.http.get(this._endpointUrlSpotify + 'artists/' + artistID + '/albums?limit=5' + '&offset=' + offset
      + '&include_groups=album', header);
  }

  private _prepTrackFromElement(element, currentPlaylist) {
    const url = element.href;
    if (!this._checkIfVideoAlreadyInPlaylist(currentPlaylist, url) && element.duration_ms >= 60000) {
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
    const maxResults = searchFor === 'track' ? '&limit=50' : '&limit=10';
    const q = '&q=' + searchValue + '*';
    const header = {'headers': {'Authorization': 'Bearer ' + this._authToken}};
    return this.http.get(this._endpointUrlSpotify + 'search/' + type + maxResults + q, header);
  }

  public processTrackSearchResult(searchResult, currentPlaylist) {
    const processedData = [];

    searchResult.tracks.items.forEach((element) => {
      const albumID = element.album.id;
      const albumElement = processedData
        .filter((data) => data.id === albumID)[0];
      const trackData = this._prepTrackFromElement(element, currentPlaylist);
      if (trackData !== undefined) {
        if (albumElement === undefined) {
          const albumData = {
            'thumbnail': element.album.images[1],
            'id': albumID,
            'name': element.album.name,
            'releaseDate': element.album.release_date.substring(0, 4),
            'tracks': [trackData]
          };
          processedData.push(albumData);
        } else {
          albumElement.tracks.push(trackData);
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
          }
          checkSum--;
          if (checkSum === 0) {
            done();
          }
        });
      });

      if (!searchResult.albums.items.length) {
        done();
      }

      function done() {
        console.log('DONE');
        observer.next(processedData);
        observer.complete();
      }
    });
  }

  public processArtistSearchResult(searchResult): Observable<Array<any>> {
    return new Observable((observer) => {
      const processedData = [];
      searchResult.artists.items.forEach((element) => {
        const artistData = {
          'thumbnail': element.images[1] === undefined ? {'url': ''} : element.images[1],
          'id': element.id,
          'name': element.name
        };
        processedData.push(artistData);
      });
      observer.next(processedData);
      observer.complete();
    });
  }

  // ToDo: use flatMap or switchMap or something
  public getAlbumsWithTracksFromArtist(artistID, offset, currentPlaylist): Observable<Array<any>> {
    return new Observable((observer) => {
      this._getAlbumsFromArtist(artistID, offset).subscribe((resultData) => {
          this.processAlbumSearchResult({'albums': resultData}, currentPlaylist).subscribe((processedData) => {
              observer.next(processedData);
              console.log(processedData);
            },
            (error) => {
              observer.next(error);
            },
            () => {
              observer.complete();
            });
        },
        (error) => {
          observer.next(error);
          observer.complete();
        });
    });
  }
}
