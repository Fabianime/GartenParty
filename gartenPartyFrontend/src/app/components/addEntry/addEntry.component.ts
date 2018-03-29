import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-addentry',
  templateUrl: './addEntry.component.html',
  styleUrls: ['./addEntry.component.scss']
})
export class AddEntryComponent implements OnInit {

  constructor() {
  }

  public test = document.cookie;
  public bLogin = false;

  ngOnInit() {
    this.checkLogin();
  }

  private checkLogin() {
    this.test += document.cookie;
    console.log(this.test);
  }
}
