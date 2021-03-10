import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Place } from 'src/app/Utilities/Models/place.model';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private router: Router, private navCtrl: NavController, private placesService: PlacesService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navigateToBookings();
        return;
      }

      const placeId = paramMap.get('placeId');
      this.place = this.placesService.place(placeId);

      if(!this.place || !this.place.id){
        this.navigateToBookings();
        return;
      }

    });
  }

  onBookPlace(){
    //this.router.navigateByUrl('/places/tabs/discover'); //displays forward animation
    //this.navCtrl.navigateBack('/places/tabs/discover'); //displays back animation
    //this.navCtrl.pop(); //pop the last page of the stack, unreliable.
    this.navigateToBookings();
  }

  navigateToBookings(){
    this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
