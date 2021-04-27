import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../../Utilities/Models/place.model';

import { LinksService } from '../../../Utilities/Services/links.service';
import { PlacesService } from '../../../Utilities/Services/places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isError: boolean = false;
  place: Place;
  private placeSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private placesService: PlacesService,
              private linksService: LinksService,
              private router: Router,
              private alertCtrl: AlertController,
              private navCtrl: NavController) { }

  ngOnInit() {
    //get the placeId from the url
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('placeId')){
        this.navigateToOffers();
        return;
      }

      this.isLoading = true;
      const placeId = parmMap.get('placeId');
      //getting it through subscription
      //this.place = this.placesService.place(placeId);
      this.placeSubscription = this.placesService.place(placeId).subscribe(place => {
        this.isLoading = false;
        this.place = place;

        if(!this.place || !this.place.id) {
          this.navigateToOffers();
          return;
        }

      },
      error => {
        this.isLoading = false;
        this.isError = true;
        this.alertCtrl.create({
                                header: 'An error occured!',
                                message: "Place could not be fetched, try again later. ",
                                buttons: [
                                  {
                                    text: "Ok",
                                    handler: () => {
                                      this.navigateToOffers();
                                    }
                                  }
                                ]
                              })
                        .then(alertEl => {
                          alertEl.present();
                        });
      });

    });
  }

  navigateToOffers(){
    //this.router.navigate(['/places/tabs/offers']);
    //this.navCtrl.navigateBack('/places/tabs/offers');
    this.navCtrl.navigateBack(this.getOffersTabLink());
  }

  getOffersTabLink(){
    return this.linksService.link_offers_tab();
  }

  getOfferEditLink(id: string): string{
    //'/','places', 'tabs', 'offers', 'edit', place?.id, 'offer'
    return this.linksService.link_offer_edit(id);
  }

  ngOnDestroy(){
    if(this.placeSubscription){
      this.placeSubscription.unsubscribe();
    }
  }

}
