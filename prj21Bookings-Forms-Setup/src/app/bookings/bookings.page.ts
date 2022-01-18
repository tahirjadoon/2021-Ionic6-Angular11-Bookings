import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

import { Booking } from '../Utilities/Models/booking.model';

import { BookingsService } from '../Utilities/Services/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];
  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onCancel(bookingId: string, slidingBooking: IonItemSliding){
    console.log(bookingId);
    slidingBooking.close();
  }

}
