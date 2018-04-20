import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppMaterialModule} from './modules/app-material.module';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {StartComponent} from './components/start/start.component';
import {MusicService} from './services/music.service';
import {HttpClientModule} from '@angular/common/http';
import {AddEntryComponent} from './components/addEntry/addEntry.component';
import {LoginComponent} from './widgets/login/login.component';
import {ProgressBarComponent} from './widgets/progress-bar/progress-bar.component';
import {LoginService} from './services/login.service';
import {PopupComponent} from './widgets/popup/popup.component';
import {ImgGalleryComponent} from './widgets/imgGallery/imgGallery.component';
import { HistoryComponent } from './widgets/history/history.component';
import {YoutubeService} from './services/youtube.service';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AddEntryComponent,
    LoginComponent,
    ProgressBarComponent,
    PopupComponent,
    ImgGalleryComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppMaterialModule
  ],
  providers: [MusicService, LoginService, YoutubeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
