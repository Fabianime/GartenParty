import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MusicService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = 'http://just-bedarf.de:8888';

  public getPlayList(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/getPlayList/' + gartenPartyID);
  }

  public getStartTrack(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/getStartTrack/' + gartenPartyID);
  }

  public setPlayList(gartenPartyID: string, listOfTracks): Observable<any> {
    let listOfTracksString = '[';
    listOfTracks.forEach((track, i) => {
      listOfTracksString += JSON.stringify(track);
      if (i !== listOfTracks.length - 1) {
        listOfTracksString += ',';
      }
    });
    listOfTracksString += ']';
    return this.http.get(this._endpointUrl + '/setPlayList/' + gartenPartyID + '/' + encodeURIComponent(listOfTracksString));
  }

  public setStartTrack(gartenPartyID: string, track: Object): Observable<any> {
    return this.http.get(this._endpointUrl + '/setStartTrack/' + gartenPartyID + '/' + track);
  }

}
