import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

import { Place } from '../../../Utilities/Models/place.model';

import { AuthService } from '../../../Utilities/Services/auth.service';
import { BookingsService } from '../../../Utilities/Services/bookings.service';
import { LinksService } from '../../../Utilities/Services/links.service';
import { PlacesService } from '../../../Utilities/Services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isError: boolean = false;
  place: Place;
  isBookable: boolean = false;

  private placeSubscription: Subscription;

  constructor(private router: Router,
      private navCtrl: NavController,
      private placesService: PlacesService,
      private authService: AuthService,
      private bookingsService: BookingsService,
      private linksService: LinksService,
      private activatedRoute: ActivatedRoute,
      private modalCntrl: ModalController,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private actionSheetCntrl: ActionSheetController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navigateToBookings();
        return;
      }

      const placeId = paramMap.get('placeId');
      /*
      this.place = this.placesService.place(placeId);
      */
      //do it through subscription
      this.isLoading = true;
      this.placeSubscription = this.placesService.place(placeId).subscribe(place => {

        this.place = place;

        if(!this.place || !this.place.id){
          this.navigateToBookings();
          return;
        }
        this.isLoading = false;
        this.isBookable = place.userId !== this.authService.userId;
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
                                      this.navigateToBookings();
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
      componentProps: { selectedPlace: this.place, selectedMode: mode }, //gets passed in as the INPUT property
      keyboardClose: true,
      swipeToClose: true
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss(); //onDidDismiss()
    if(role === "confirm"){
      console.log(data.message);
      //confirmation back, book the place
      //show loading controller
      this.loadingCtrl.create({message: 'Booking place...', keyboardClose: false})
                      .then(loadingEl => {
                        loadingEl.present();

                        this.bookingsService.addBookingManual(this.place.id, this.place.title, this.place.imageUrl, data.message.firstName, data.message.lastName, data.message.guestNumer, data.message.startDate, data.message.endDate)
                                            .subscribe(() => {
                                              loadingEl.dismiss();
                                              //this.presentAlert(`Message passed back<br/><br/>${data.message.firstName}<br/><br/>Role '${role}' passed back`);
                                              this.router.navigate([this.linksService.link_bookings()]);
                                            });
                      });
    }
    else{
      this.presentAlert(`Cancel clicked!<br/><br/>Role '${role}' passed back`);
    }
  }

  async presentAlert(message: string){
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  navigateToBookings(){
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.navCtrl.navigateBack(this.linksService.link_discover_tab());
  }

  getPlacesTabsDiscoverLink(): string{
    return this.linksService.link_discover_tab();
  }

  ngOnDestroy(){
    if(this.placeSubscription){
      this.placeSubscription.unsubscribe();
    }
  }
}
