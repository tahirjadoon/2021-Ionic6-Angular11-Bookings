import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/Utilities/Models/place.model';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('placeId')){
        this.navigateToOffers(null);
        return;
      }

      const placeId = parmMap.get('placeId');
      this.place = this.placesService.place(placeId);

      if(!this.place || !this.place.id){
        this.navigateToOffers(placeId);
        return;
      }
    });
  }

  navigateToOffers(placeId){
    if(!placeId){
      this.navCtrl.navigateBack('/places/tabs/offers');
      return;
    }

    this.navCtrl.navigateBack(['/', 'places', 'tabs', 'offers', 'offer', placeId, 'bookings']);
  }


}
