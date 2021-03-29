import { Injectable } from '@angular/core';
import { Booking } from '../Models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor() { }

  private _bookings: Booking[] = [
    { id: 'xyz', placeId: "p1", userId: 'abc', placeTitle: 'Manhattan Mansion', guestNumber: 2 }
  ];

  get bookings(){
    return [...this._bookings];
  }
}
