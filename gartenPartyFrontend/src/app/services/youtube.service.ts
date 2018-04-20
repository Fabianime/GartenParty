import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class YoutubeService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = 'https://www.googleapis.com/youtube/v3/';

  public getSearchResult(searchValue: string): Observable<any> {
    const key = '?key=AIzaSyDEL2h-pxbQjnymytTP5jqB58mKgfV9eQk';
    const part = '&part=snippet';
    const maxResults = '&maxResults=25';
    const type = '&type=video';
    const q = '&q=' + searchValue;

    return this.http.get(this._endpointUrl + 'search/' + key + part + maxResults + type + q);
  }

  public getContentDetailsOfTrack(videoId: string): Observable<any> {
    const key = '?key=AIzaSyDEL2h-pxbQjnymytTP5jqB58mKgfV9eQk';
    const part = '&part=contentDetails';
    const id = '&id=' + videoId;

    return this.http.get(this._endpointUrl + 'videos/' + key + part + id);
  }

}
