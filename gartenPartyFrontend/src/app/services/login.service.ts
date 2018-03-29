import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = 'http://localhost:8888';

  public checkLogin(gartenPartyID: string): Observable<any> {
    return this.http.get(this._endpointUrl + '/checkPartys/' + gartenPartyID);
  }
}
