import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';

import { Booking } from '../Models/booking.model';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private authService: AuthService) { }

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(){
    //return [...this._bookings];
    return this._bookings.asObservable();
  }

  addBooking(newBooking: Booking){
    return this.bookings.pipe(take(1),
                              delay(2000),
                              tap(bookings => {
                                this._bookings.next(bookings.concat(newBooking));
                              })
                            );
  }

  addBookingManual(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date){
    const newBooking = new Booking(Math.random().toString(),
                                  placeId,
                                  this.authService.userId,
                                  placeTitle,
                                  placeImage,
                                  firstName,
                                  lastName,
                                  guestNumber,
                                  dateFrom,
                                  dateTo);
    return this.addBooking(newBooking);
  }

  cancelBooking(bookingId: string){
    return this.bookings.pipe(take(1),
                              delay(2000),
                              tap(bookings => {
                                this._bookings.next(bookings.filter(b => b.id !== bookingId));
                              })
                            );
  }
}
