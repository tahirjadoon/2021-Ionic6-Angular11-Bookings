import { Component, OnInit } from '@angular/core';

import { Place } from 'src/app/Utilities/Models/place.model';

import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places; //getter property
  }

}
