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

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });

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
  }

}
