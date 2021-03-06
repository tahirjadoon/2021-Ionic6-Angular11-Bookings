import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

import { Place } from 'src/app/Utilities/Models/place.model';

import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[]; //for virtual scroll

  constructor(private placesService: PlacesService, private menuCntrl: MenuController) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places; //getter property

    //for the virtual scroll
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onMenuDrawerOpen(){
    //this.menuCntrl.open("menu1");
    this.menuCntrl.toggle("menu1");
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail.value);
  }

}
