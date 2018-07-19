import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppMaterialModule} from './modules/app-material.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {StartComponent} from './components/start/start.component';
import {AddEntryComponent} from './components/addEntry/addEntry.component';
import {CheckRoutComponent} from './components/check-rout/check-rout.component';
import {LoginComponent} from './widgets/login/login.component';
import {PlaylistComponent} from './widgets/playlist/playlist.component';
import {PopupComponent} from './widgets/popup/popup.component';
import {HistoryComponent} from './widgets/history/history.component';
import {ProgressBarComponent} from './widgets/progress-bar/progress-bar.component';
import {MusicService} from './services/music.service';
import {LoginService} from './services/login.service';
import {YoutubeService} from './services/youtube.service';
import {SpotifyService} from './services/spotify.service';
import {ResultDisplayYoutubeComponent} from './widgets/result-display-youtube/result-display-youtube.component';
import {ResultDisplaySpotifyComponent} from './widgets/result-display-spotify/result-display-spotify.component';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AddEntryComponent,
    LoginComponent,
    ProgressBarComponent,
    PopupComponent,
    ResultDisplayYoutubeComponent,
    HistoryComponent,
    PlaylistComponent,
    CheckRoutComponent,
    ResultDisplaySpotifyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppMaterialModule,
  ],
  providers: [
    MusicService,
    LoginService,
    YoutubeService,
    SpotifyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
