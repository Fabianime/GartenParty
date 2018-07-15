import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class MusicService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = environment.apiUrl;

  public getPlayList(gartenPartyID: string): Observable<any> {
    return this.http.post(this._endpointUrl + '/getPlayList', {'playlistID': gartenPartyID});
  }

  public getStartTrack(gartenPartyID: string): Observable<any> {
    return this.http.post(this._endpointUrl + '/getStartTrack', {'playlistID': gartenPartyID});
  }

  public setPlayList(gartenPartyID: string, listOfTracks): Observable<any> {
    return this.http.post(this._endpointUrl + '/setPlayList', {'playlistID': gartenPartyID, 'playlistData': listOfTracks});
  }

  public setStartTrack(gartenPartyID: string, startTrackPosition: string): Observable<any> {
    return this.http.post(this._endpointUrl + '/setStartTrack', {'': gartenPartyID, 'startTrackPosition': startTrackPosition});
  }

  public deleteTrack(playlistID: string, videoUrlToDelete: string): Observable<any> {
    return this.http.post(this._endpointUrl + '/deleteTrack', {'playlistID': playlistID, 'videoUrlToDelete': videoUrlToDelete});
  }

}
