import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  @Output() bShowChange = new EventEmitter();

  @Output() generateBodyFunctionCall = new EventEmitter();

  @Input()
  public bShow: boolean;

  @Input()
  public header: string;

  @Input()
  public innerHtml: string;

  @Input()
  public footer: string;

  @Input()
  public checkGenerateBody = false;

  @Input()
  public generateBodyData = [];

  bodyElementWasClicked(id): void {
    this.generateBodyFunctionCall.emit([id]);
  }

  constructor() {
  }


  ngOnInit() {
  }

  closePopup() {
    this.bShow = false;
    this.bShowChange.emit(this.bShow);
  }


}
