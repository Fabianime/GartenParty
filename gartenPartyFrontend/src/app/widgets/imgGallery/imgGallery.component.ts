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
  public selectedVideos: Array;

  constructor() {
  }

  public toggleSelectedVideo(val){
    if(this.selectedVideos.indexOf(val) >= 0){
      this.selectedVideos.splice(this.selectedVideos.indexOf(val),1);
    }else{
      this.selectedVideos.push(val);
    }
  }

  public checkIfVideoSelected(val){
    return this.selectedVideos.indexOf(val) >= 0;
  }

}
