import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MusicService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = 'http://localhost:8888';

  public getPlayList(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/getPlayList/' + gartenPartyID);
  }
}
