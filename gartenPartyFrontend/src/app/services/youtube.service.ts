import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class YoutubeService {

  constructor(private http: HttpClient) {
  }

  private _endpointUrl = 'https://www.googleapis.com/youtube/v3/';

  public getSearchResult(searchValue: string, nextPageToken?: string): Observable<any> {
    const key = '?key=AIzaSyDEL2h-pxbQjnymytTP5jqB58mKgfV9eQk';
    const part = '&part=snippet';
    const maxResults = '&maxResults=25';
    const pageToken = nextPageToken === undefined ? '' : '&pageToken=' + nextPageToken;
    const type = '&type=video';
    const q = '&q=' + searchValue;

    return this.http.get(this._endpointUrl + 'search/' + key + part + maxResults + pageToken + type + q);
  }

  public getContentDetailsOfTrack(videoId: string): Observable<any> {
    const key = '?key=AIzaSyDEL2h-pxbQjnymytTP5jqB58mKgfV9eQk';
    const part = '&part=contentDetails';
    const id = '&id=' + videoId;

    return this.http.get(this._endpointUrl + 'videos/' + key + part + id);
  }

  public processSearchResult(searchResult, currentPlaylist, lengthOfCurrentList) {
    const processedData = [];
    searchResult.items.forEach((element) => {
      const tmp = {
        'title': (element.snippet.title.length > 55 ? element.snippet.title.substring(0, 52) + '...' : element.snippet.title),
        'thumbnail': element.snippet.thumbnails.medium,
        'description': element.snippet.description,
        'url': 'https://www.youtube.com/watch?v=' + element.id.videoId
      };
      if (!this._checkIfVideoAlreadyInPlaylist(currentPlaylist, tmp.url) && processedData.length + lengthOfCurrentList <= 25) {
        processedData.push(tmp);
      }
    });
    return processedData;
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

}
