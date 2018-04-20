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
      'link': this.data[indexOfVideo].link
    };
    let isSelected = false;
    let indexOfSelected = -1;

    this.selectedVideos.forEach((videoElement, index) => {
      if (videoElement.link === tmp.link) {
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
      'link': this.data[indexOfVideo].link
    };
    let isSelected = false;

    this.selectedVideos.forEach((videoElement) => {
      if (videoElement.link === tmp.link) {
        isSelected = true;
      }
    });
    return isSelected;
  }

}
