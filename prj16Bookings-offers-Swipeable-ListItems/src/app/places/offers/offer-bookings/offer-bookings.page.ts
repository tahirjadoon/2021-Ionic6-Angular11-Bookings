import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { Place } from 'src/app/Utilities/Models/place.model';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;

  constructor(private activatedRoute: ActivatedRoute, private placesService: PlacesService, private router: Router, private alertCtrl: AlertController, private navCtrl: NavController) { }

  ngOnInit() {
    //get the placeId from the url
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('placeId')){
        this.navigateToOffers();
        return;
      }

      const placeId = parmMap.get('placeId');
      this.place = this.placesService.place(placeId);

      if(!this.place || !this.place.id) {
        this.navigateToOffers();
        return;
      }
    });
  }

  navigateToOffers(){
    //this.router.navigate(['/places/tabs/offers']);
    this.navCtrl.navigateBack('/places/tabs/offers');
  }

}
