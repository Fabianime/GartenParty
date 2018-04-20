import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  @Input()
  public selectedVideos;

  constructor() {
  }

  public showSelectedView = false;
  public undoList = [];

  public toggleVideoSelectedView() {
    this.showSelectedView = !this.showSelectedView;
  }

  public deleteVideoFromSelectedList(val) {
    const indexOfDeletedVideo = this.selectedVideos.indexOf(val);
    if (indexOfDeletedVideo >= 0) {

      this.undoList.push({'value': this.selectedVideos[indexOfDeletedVideo], 'index': indexOfDeletedVideo});
      this.selectedVideos.splice(this.selectedVideos.indexOf(val), 1);
    }
  }

  public undoDeleteFromSelectedList() {
    const videoToUndo = this.undoList[this.undoList.length - 1];
    this.selectedVideos.splice(videoToUndo.index, 0, videoToUndo.value);
    this.undoList.pop();
  }

}
