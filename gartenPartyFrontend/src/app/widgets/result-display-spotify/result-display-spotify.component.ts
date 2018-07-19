import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-result-display-spotify',
  templateUrl: './result-display-spotify.component.html',
  styleUrls: ['./result-display-spotify.component.scss']
})
export class ResultDisplaySpotifyComponent implements OnInit {
  @Output() loadMorAlbumsEmitter = new EventEmitter();

  @Input()
  public listOfElementsToDisplay;

  @Input()
  public selectedVideos;

  @Input()
  public displayType;

  @Input()
  public offset;

  public showTracksOfAlbum = [];

  ngOnInit() {
    if (this.displayType === 'track') {
      this.showTracksOfAlbum = Array.apply(null, {length: this.listOfElementsToDisplay.length}).map(Number.call, Number);
    }
  }

  loadMoreAlbums(): void {
    this.loadMorAlbumsEmitter.emit();
  }

  public toggleSelectedTrack(indexOfAlbum, indexOfTrack) {
    const tmp = {
      'name': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].title,
      'url': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].url,
      'length': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].length
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

  public checkIfTrackIsSelected(indexOfAlbum, indexOfTrack) {
    const tmp = {
      'name': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].title,
      'url': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].url,
      'length': this.listOfElementsToDisplay[indexOfAlbum].tracks[indexOfTrack].length
    };
    let isSelected = false;

    this.selectedVideos.forEach((videoElement) => {
      if (videoElement.url === tmp.url) {
        isSelected = true;
      }
    });
    return isSelected;
  }

  public toggleAlbumToSelected(albumIndex) {
    const isAlbumSelected = this.checkIfAlbumIsSelected(albumIndex);
    this.listOfElementsToDisplay[albumIndex].tracks.forEach((trackData, trackIndex) => {
      if (
        (isAlbumSelected && this.checkIfTrackIsSelected(albumIndex, trackIndex)) ||
        (!isAlbumSelected && !this.checkIfTrackIsSelected(albumIndex, trackIndex))
      ) {
        this.toggleSelectedTrack(albumIndex, trackIndex);
      }
    });
  }

  public toggleTrackView(albumIndex) {
    const indexOfAlbumInArray = this.showTracksOfAlbum.indexOf(albumIndex);
    if (indexOfAlbumInArray >= 0) {
      this.showTracksOfAlbum.splice(indexOfAlbumInArray, 1);
    } else {
      this.showTracksOfAlbum.push(albumIndex);
    }
  }

  public checkIfAlbumIsSelected(albumIndex) {
    let isSelected = true;
    this.listOfElementsToDisplay[albumIndex].tracks.forEach((trackData, trackIndex) => {
      if (!this.checkIfTrackIsSelected(albumIndex, trackIndex)) {
        isSelected = false;
      }
    });
    return isSelected;
  }
}
