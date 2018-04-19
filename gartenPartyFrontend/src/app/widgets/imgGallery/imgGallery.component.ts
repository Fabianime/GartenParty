import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-img-gallery',
  templateUrl: './imgGallery.component.html',
  styleUrls: ['./imgGallery.component.scss']
})
export class ImgGalleryComponent {

  @Input()
  public data;

  constructor() {
  }

}
