import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
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

  constructor(private router: Router,
      private navCtrl: NavController,
      private placesService: PlacesService,
      private activatedRoute: ActivatedRoute,
      private modalCntrl: ModalController,
      private alertCntrl: AlertController,
      private actionSheetCntrl: ActionSheetController) { }

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

    this.presentActionSheet();
  }

  async presentActionSheet(){
    const actionSheet = await this.actionSheetCntrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.presentModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.presentModal('random');
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: 'cancel', //dont use destructive, it is for delete
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentModal(mode: 'select' | 'random'){ //mode must be passed in as select or random
    console.log("mode:" + mode);

    //open modal ==> pass the date into it using the componentProps
    let modal = await this.modalCntrl.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place }, //gets passed in as the INPUT property
      keyboardClose: true,
      swipeToClose: true
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss(); //onDidDismiss()
    if(role === "confirm"){
      this.presentAlert(`Message passed back<br/><br/>${data.message}<br/><br/>Role '${role}' passed back`);
    }
    else{
      this.presentAlert(`Cancel clicked!<br/><br/>Role '${role}' passed back`);
    }
  }

  async presentAlert(message: string){
    const alert = await this.alertCntrl.create({
      header: 'Alert',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  navigateToBookings(){
    this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
