import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';

import { Place } from 'src/app/Utilities/Models/place.model';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private router: Router, private navCtrl: NavController, private placesService: PlacesService, private activatedRoute: ActivatedRoute, private modalCntrl: ModalController) { }

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
    //this.navigateToBookings();

    //open modal
    this.modalCntrl.create({
                    component: CreateBookingComponent,
                    keyboardClose: true
                  })
                  .then(modalEelem => {
                    modalEelem.present();
                  });
  }

  navigateToBookings(){
    this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
