import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Booking } from '../Utilities/Models/booking.model';

import { BookingsService } from '../Utilities/Services/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSub: Subscription;
  bookingCancelSub: Subscription;
  fetchBookingsSubscription: Subscription;
  isLoading = false;
  isError = false;

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  //not using
  ionViewWillEnter(){
    this.isLoading = true;
    //fetch the places from the database. ngOnInIt then fetches from the local array in places.service.ts
    this.fetchBookingsSubscription = this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    }
    ,
      error => {
        this.isLoading = false;
        this.isError = true;
        this.alertCtrl.create({
                                header: 'An error occured!',
                                message: "Bookings could not be fetched, try again later. ",
                                buttons: [
                                  {
                                    text: "Ok",
                                    handler: () => {
                                      //this.navigateToBookings();
                                    }
                                  }
                                ]
                              })
                        .then(alertEl => {
                          alertEl.present();
                        });
      }
    );
  }

  onCancel(bookingId: string, placeTitle: string, slidingBooking: IonItemSliding){
    console.log(bookingId);

    this.alertCtrl.create({
                            header: "Cancel Confirm",
                            message: `Are you sure to cancel '${bookingId} - ${placeTitle}'?`,
                            buttons: [
                              {
                                text: 'OK',
                                handler: () => {
                                  this.loadingCtrl.create({message: "Cancelling booking...", keyboardClose: false})
                                                  .then(loadingEl => {
                                                    loadingEl.present();
                                                    this.bookingCancelSub = this.bookingsService.cancelBooking(bookingId).subscribe(() => {
                                                      slidingBooking.close();
                                                      loadingEl.dismiss();
                                                    });
                                                  });
                                }
                              },
                              {
                                text: 'Cancel',
                                handler: () => {
                                  slidingBooking.close();
                                }
                              }
                            ]
                          })
                  .then(alertElem => {
                    alertElem.present();
                   });
  }

  ngOnDestroy(){
    if(this.bookingSub){
      this.bookingSub.unsubscribe();
    }
    if(this.bookingCancelSub){
      this.bookingCancelSub.unsubscribe();
    }
    if(this.fetchBookingsSubscription){
      this.fetchBookingsSubscription.unsubscribe();
    }
  }

}
