import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-addentry',
  templateUrl: './addEntry.component.html',
  styleUrls: ['./addEntry.component.scss']
})
export class AddEntryComponent implements OnInit {
  public bLogin;

  constructor(private loginService: LoginService, private http: HttpClient) {
  }

  public test = document.cookie;

  private _searchString;
  private _endpointUrl = 'https://www.googleapis.com/youtube/v3/search';

  public aData = [];

  @Output() searchStringChange = new EventEmitter();

  @Input()
  get searchString() {
    return this._searchString;
  }

  ngOnInit() {
    this.checkLogin();
  }

  set searchString(val) {
    this._searchString = val;
    this.searchStringChange.emit(this._searchString);
    setTimeout(() => {
      if (val === this._searchString) {
        this.getSearchResult(this._searchString).subscribe((data) => {
          this.aData = [];
          data.items.forEach((element) => {
            const tmp = {
              'title': element.snippet.title,
              'thumbnail': element.snippet.thumbnails.medium,
              'description': element.snippet.videoId,
              'link': 'https://www.youtube.com/watch?v=' + element.id.videoId
            };
            this.aData.push(tmp);
          });
          console.log(this.aData);
        });
      } else {
        console.log(val);
        console.log(this._searchString);
      }
    }, 1000);
  }

  public getSearchResult(searchValue: string): Observable<any> {
    const key = '?key=AIzaSyDEL2h-pxbQjnymytTP5jqB58mKgfV9eQk';
    const part = '&part=snippet';
    const maxResults = '&maxResults=25';
    const type = '&type=video';
    const q = '&q=' + searchValue;

    return this.http.get(this._endpointUrl + key + part + maxResults + type + q);
  }

  private checkLogin() {
    this.loginService.checkGartenPartyID().subscribe((data) => {
      if (data.status === 200) {
        this.bLogin = data.response;
      } else {
        throw data.error;
        // toDO: return False + logs mit fehler schreiben
      }
    });
  }
}
