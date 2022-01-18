import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { zHttpAction } from '../../Utilities/Enums/zHttpAction.enum';

import { FireBase } from '../../Utilities/Models/firebase.model';
import { Place } from '../../Utilities/Models/place.model';

import { LinksService } from '../../Utilities/Services/links.service';
import { PlacesService } from '../../Utilities/Services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  offers: Place[] = [];
  private placesSubscription: Subscription;
  private fetchPlacesSubscription : Subscription;
  @ViewChild(IonItemSliding, {static: true}) slidingItem: IonItemSliding;

  constructor(private placesService: PlacesService, private linksService: LinksService, private router: Router) { }

  //since observable is being used, using the ngOnInit rather than ionViewWillEnter
  ngOnInit() {
    //const url = new FireBase(zHttpAction.PlaceUpdate);
    //console.log(url.finalUrl("-MY2xbDTuhwsRiQIsEk7", false));

    //this.offers = this.placesService.places;
    this.placesSubscription = this.placesService.places.subscribe(localPlaces => {
      this.offers = localPlaces;
    })
  }

  //not using
  ionViewWillEnter(){
    this.isLoading = true;
    //fetch the places from the database. ngOnInIt then fetches from the local array in places.service.ts
    this.fetchPlacesSubscription = this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
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
    if(this.fetchPlacesSubscription){
      this.fetchPlacesSubscription.unsubscribe();
    }
  }

}
