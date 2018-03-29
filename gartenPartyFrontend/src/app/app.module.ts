import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {StartComponent} from './components/start/start.component';
import {MusicService} from './services/music.service';
import {HttpClientModule} from '@angular/common/http';
import {AddEntryComponent} from './components/addEntry/addEntry.component';
import {LoginComponent} from './widgets/login/login.component';
import {LoginService} from './services/login.service';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AddEntryComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [MusicService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
