import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import {AddEntryComponent} from './components/addEntry/addEntry.component';
import {CheckRoutComponent} from './components/check-rout/check-rout.component';

const routes: Routes = [
  {
    path: '',
    component: StartComponent
  },
  {
    path: 'addEntry',
    component: AddEntryComponent
  },
  {
    path: '**',
    component: CheckRoutComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
