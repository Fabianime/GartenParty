import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = environment.apiUrl;

  public setGartenPartyID(gartenPartyID) {
    this.createCookie('gartenPartyID', gartenPartyID, 1);
  }

  private createCookie(name, value, days) {
    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  public checkGartenPartyID(): Observable<any> {
    return this.http.post(this._endpointUrl + '/checkPlaylist', {'playlistID': this.getGartenPartyID()});
  }

  public getGartenPartyID() {
    const strCookies = document.cookie.split(';');
    const cookieName = 'gartenPartyID';
    let returnValue = '';
    for (let i = 0; i < strCookies.length; i++) {
      const cookie = strCookies[i];
      if (cookie.indexOf(cookieName) >= 0) {
        returnValue = cookie.split('=')[1];
      }
    }
    return returnValue;
  }

  public logout() {
    this.setGartenPartyID('logout');
  }
}
