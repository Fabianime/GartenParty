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


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AddEntryComponent,
    LoginComponent,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppMaterialModule
  ],
  providers: [MusicService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
