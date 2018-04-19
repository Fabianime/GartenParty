import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient, ) {
  }
  private url = location.href.substr(location.href.search('//') + 2, location.href.substr(location.href.search('//') + 2).search(':'));
  private _endpointUrl = 'http://' + this.url + ':8888';

  public checkGartenPartyID(): Observable<any> {
    return this.http.get(this._endpointUrl + '/checkPartys/' + this.getGartenPartyID());
  }

  public getGartenPartyID() {
    const strCookies = document.cookie.split(';');
    const cookieName = 'gartenPartyID';
    let returnValue = '';
    for (let i = 0; i < strCookies.length; i++) {
      let cookie = strCookies[i];
      if(cookie.indexOf(cookieName) >= 0){
        returnValue = cookie.substring(cookieName.length + 1, cookie.length);
      }
    }
    return returnValue;
  }
}
