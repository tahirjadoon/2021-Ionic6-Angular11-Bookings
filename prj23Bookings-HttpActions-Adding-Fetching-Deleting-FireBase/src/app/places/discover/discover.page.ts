import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { Place } from '../../Utilities/Models/place.model';

import { AuthService } from '../../Utilities/Services/auth.service';
import { LinksService } from '../../Utilities/Services/links.service';
import { PlacesService } from '../../Utilities/Services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = []; //for virtual scroll
  relevantPlaces: Place[] = this.loadedPlaces;
  userId: string = "";
  private loadedPlacesSubscription: Subscription;
  private fetchPlacesSubscription: Subscription;

  constructor(private authService: AuthService,
            private placesService: PlacesService,
            private linksService: LinksService,
            private menuCntrl: MenuController) { }

  ngOnInit() {
    console.log('ngOnInIt');
    this.loadData();
  }

  //using observable so will load data on ngOnInit
  ionViewWillEnter(){
    this.userId = this.authService.userId;
    this.isLoading = true;
    //fetch the places from the database. ngOnInIt then fetches from the local array in places.service.ts
    this.fetchPlacesSubscription = this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  loadData(){
    this.loadedPlacesSubscription = this.placesService.places.subscribe(localPlaces => {
      this.loadedPlaces = localPlaces;
      this.relevantPlaces = this.loadedPlaces;
      //for the virtual scroll
      //this.listedLoadedPlaces = this.loadedPlaces.slice(1);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
    /*
    this.loadedPlaces = this.placesService.places; //getter property
    //for the virtual scroll
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    */
  }

  onMenuDrawerOpen(){
    //this.menuCntrl.open("menu1");
    this.menuCntrl.toggle("menu1");
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail.value);
    if(event.detail.value === 'all'){
      //show all
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
    else{
      //show where the user is not me
      this.relevantPlaces = this.loadedPlaces.filter(p => p.userId !== this.authService.userId);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  getDiscoverPageDetailLink(pleaseId: string): string{
    return this.linksService.link_discover_place_detail(pleaseId);
  }

  ngOnDestroy(){
    if(this.loadedPlacesSubscription){
      this.loadedPlacesSubscription.unsubscribe();
    }
    if(this.fetchPlacesSubscription){
      this.fetchPlacesSubscription.unsubscribe();
    }
  }

}
