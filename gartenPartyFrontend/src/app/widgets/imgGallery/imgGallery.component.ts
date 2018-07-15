import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-img-gallery',
  templateUrl: './imgGallery.component.html',
  styleUrls: ['./imgGallery.component.scss']
})
export class ImgGalleryComponent {

  @Input()
  public data;

  @Input()
  public selectedVideos;

  constructor() {
  }

  public toggleSelectedVideo(indexOfVideo) {
    const tmp = {
      'name': this.data[indexOfVideo].title,
      'url': this.data[indexOfVideo].url
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
      'name': this.data[indexOfVideo].title,
      'url': this.data[indexOfVideo].url
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
