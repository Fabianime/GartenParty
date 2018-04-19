import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Output() bShowChange = new EventEmitter();

  @Input()
  public bShow;

  @Input()
  public header;

  @Input()
  public body;

  @Input()
  public footer;

  constructor() { }


  ngOnInit() {
  }

  closePopup(){
    this.bShow = false;
    this.bShowChange.emit(this.bShow);
  }

}
