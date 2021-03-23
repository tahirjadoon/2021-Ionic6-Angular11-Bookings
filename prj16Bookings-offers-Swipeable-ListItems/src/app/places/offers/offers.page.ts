import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

import { Place } from 'src/app/Utilities/Models/place.model';

import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: Place[];
  @ViewChild(IonItemSliding, {static: true}) slidingItem: IonItemSliding;

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.offers = this.placesService.places;
  }

  //can't pass the local reference like onEdit has it
  onAdd(){
    this.router.navigateByUrl('/places/tabs/offers/new');
  }

  onEdit(offerId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    // /places/tabs/offers/edit/12345/offer
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId, 'offer']);
  }

}
