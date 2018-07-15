import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-result-display-spotify',
  templateUrl: './result-display-spotify.component.html',
  styleUrls: ['./result-display-spotify.component.scss']
})
export class ResultDisplaySpotifyComponent implements OnInit {
  @Input()
  public data;

  @Input()
  public selectedVideos;

  @Input()
  public displayType;

  public showTracksOfAlbum = [];

  ngOnInit() {
    if (this.displayType === 'track') {
      this.showTracksOfAlbum = Array.apply(null, {length: this.data.length}).map(Number.call, Number);
    }
  }

  public toggleSelectedTrack(indexOfAlbum, indexOfTrack) {
    const tmp = {
      'name': this.data[indexOfAlbum].tracks[indexOfTrack].title,
      'url': this.data[indexOfAlbum].tracks[indexOfTrack].url,
      'length': this.data[indexOfAlbum].tracks[indexOfTrack].length
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
      'name': this.data[indexOfAlbum].tracks[indexOfTrack].title,
      'url': this.data[indexOfAlbum].tracks[indexOfTrack].url,
      'length': this.data[indexOfAlbum].tracks[indexOfTrack].length
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
    this.data[albumIndex].tracks.forEach((trackData, trackIndex) => {
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
    this.data[albumIndex].tracks.forEach((trackData, trackIndex) => {
      if (!this.checkIfTrackIsSelected(albumIndex, trackIndex)) {
        isSelected = false;
      }
    });
    return isSelected;
  }
}
