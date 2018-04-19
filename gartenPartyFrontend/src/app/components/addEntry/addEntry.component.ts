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

  public testf = document.cookie;
  public popupHeader = 'Header';
  public popupBody = '<p>Body</p>';
  public popupFooter = 'Footer';
  public bChange = false;

  private _searchString = 'eminem';
  private _endpointUrl = 'https://www.googleapis.com/youtube/v3/search';

  public aData = [];
  public bTest = false;

  @Output() searchStringChange = new EventEmitter();

  @Input()
  get searchString() {
    return this._searchString;
  }

  ngOnInit() {
    this.checkLogin();
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
    });
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
        });
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

  public test() {
    this.bTest = !this.bTest;
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
