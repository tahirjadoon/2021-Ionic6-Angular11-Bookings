import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { Place } from 'src/app/Utilities/Models/place.model';

import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService, private menuCntrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places; //getter property
  }

  onMenuDrawerOpen(){
    //this.menuCntrl.open("menu1");
    this.menuCntrl.toggle("menu1");
  }

}
