import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { Place } from 'src/app/Utilities/Models/place.model';

import { AuthService } from 'src/app/Utilities/Services/auth.service';
import { LinksService } from 'src/app/Utilities/Services/links.service';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = []; //for virtual scroll
  relevantPlaces: Place[] = this.loadedPlaces;
  userId: string = "";
  private loadedPlacesSubscription: Subscription;

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
    console.log('ionViewWillEnter');
    //this.loadData();
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
  }

}
