import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from 'src/app/Utilities/Models/place.model';

import { LinksService } from 'src/app/Utilities/Services/links.service';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[] = [];
  private placesSubscription: Subscription;
  @ViewChild(IonItemSliding, {static: true}) slidingItem: IonItemSliding;

  constructor(private placesService: PlacesService, private linksService: LinksService, private router: Router) { }

  //since observable is being used, using the ngOnInit rather than ionViewWillEnter
  ngOnInit() {
    //this.offers = this.placesService.places;
    this.placesSubscription = this.placesService.places.subscribe(localPlaces => {
      this.offers = localPlaces;
    })
  }

  //not using
  ionViewWillEnter(){
    //this.offers = this.placesService.places;
  }

  //can't pass the local reference like onEdit has it
  onAdd(){
    //this.router.navigateByUrl('/places/tabs/offers/new');
    this.router.navigateByUrl(this.linksService.link_offer_new());
  }

  onEdit(offerId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    // /places/tabs/offers/edit/12345/offer
    //this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId, 'offer']);
    this.router.navigate([this.linksService.link_offer_edit(offerId)]);
  }

  ngOnDestroy(){
    if(this.placesSubscription){
      this.placesSubscription.unsubscribe();
    }
  }

}
