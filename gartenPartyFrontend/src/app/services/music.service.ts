import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MusicService {

  constructor(private http: HttpClient) {
  }

  private url = location.href.substr(location.href.search('//') + 2, location.href.substr(location.href.search('//') + 2).search(':'));
  private _endpointUrl = 'http://' + this.url + ':8888';

  public getPlayList(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/getPlayList/' + gartenPartyID);
  }

  public getCurrentTrack(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/getCurrentTrack/' + gartenPartyID);
  }
}
