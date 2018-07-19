import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-result-display-youtube',
  templateUrl: './result-display-youtube.component.html',
  styleUrls: ['./result-display-youtube.component.scss']
})
export class ResultDisplayYoutubeComponent {

  @Input()
  public listOfElementsToDisplay;

  @Input()
  public selectedVideos;

  constructor() {
  }

  public toggleSelectedVideo(indexOfVideo) {
    const tmp = {
      'name': this.listOfElementsToDisplay[indexOfVideo].title,
      'url': this.listOfElementsToDisplay[indexOfVideo].url
    };
    let isSelected = false;
    let indexOfSelected = -1;

    this.selectedVideos.forEach((videoElement, index) => {
      if (videoElement.url === tmp.url) {
        isSelected = true;
        indexOfSelected = index;
      }
    });

    if (isSelected) {
      this.selectedVideos.splice(indexOfSelected, 1);
    } else {
      this.selectedVideos.push(tmp);
    }
  }

  public checkIfVideoSelected(indexOfVideo) {
    const tmp = {
      'name': this.listOfElementsToDisplay[indexOfVideo].title,
      'url': this.listOfElementsToDisplay[indexOfVideo].url
    };
    let isSelected = false;

    this.selectedVideos.forEach((videoElement) => {
      if (videoElement.url === tmp.url) {
        isSelected = true;
      }
    });
    return isSelected;
  }

}
