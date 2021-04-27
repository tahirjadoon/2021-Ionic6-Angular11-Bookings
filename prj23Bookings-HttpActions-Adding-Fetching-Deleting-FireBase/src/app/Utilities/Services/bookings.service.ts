import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { zHttpAction } from '../Enums/zHttpAction.enum';

import { Booking } from '../Models/booking.model';
import { FireBase } from '../Models/firebase.model';

import { AuthService } from './auth.service';
import { HttpclientService } from './httpclient.service';

import { IBookingDataFireBase } from '../Interfaces/bookingsdatafirebase.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private authService: AuthService, private httpService : HttpclientService) { }

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(){
    //return [...this._bookings];
    return this._bookings.asObservable();
  }

  fetchBookings(){
    const url = new FireBase(zHttpAction.BookingsFetch);
    const finalUrl = url.finalUrlWithQueryString(null, null, `orderBy="userId"&equalTo="${this.authService.userId}"`);
    console.log("** url=" + finalUrl);
    return this.httpService.get<{[key: string]: IBookingDataFireBase}>(finalUrl)
                                                                      .pipe(
                                                                        delay(1000),
                                                                        map(resData => {
                                                                          const fetchedBookings: Booking[] = [];
                                                                          for(const key in resData){
                                                                            if(resData.hasOwnProperty(key)){
                                                                              fetchedBookings.push(new Booking(key, resData[key].placeId, resData[key].userId, resData[key].placeTitle, resData[key].placeImage, resData[key].firstName, resData[key].lastName, +resData[key].guestNumber, new Date(resData[key].bookedFrom), new Date(resData[key].bookedTo)));
                                                                            }
                                                                          }
                                                                          return fetchedBookings;
                                                                        }),
                                                                        tap(fetchedBookings => {
                                                                          this._bookings.next(fetchedBookings);
                                                                        })
                                                                      );
  }

  addBooking(newBooking: Booking){
    if(FireBase.isAppStoreModeLocal){
      return this.bookings.pipe(take(1),
                              delay(2000),
                              tap(bookings => {
                                this._bookings.next(bookings.concat(newBooking));
                              })
                            );
    }
    else{
      let generateId: string = "";
      const url = new FireBase(zHttpAction.BookingsAdd);
      return this.httpService.post<{name: string}>(url.finalUrl(), {...newBooking, id:null})
                            .pipe(
                                switchMap(resData => {
                                  generateId = resData.name;
                                  return this.bookings;
                                }),
                                take(1),
                                tap(bookings => {
                                  if(FireBase.hasAppStoreModeLocal) {
                                    newBooking.id = generateId;
                                    this._bookings.next(bookings.concat(newBooking));
                                  }
                                  else{
                                    this._bookings.next(bookings);
                                  }
                                })
                            );
    }

  }

  addBookingManual(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date){
    const newBooking = new Booking(FireBase.hasAppStoreModeDatabase ? null : Math.random().toString(),
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
    if(FireBase.isAppStoreModeLocal){
      return this.bookings.pipe(take(1),
                                delay(2000),
                                tap(bookings => {
                                  this._bookings.next(bookings.filter(b => b.id !== bookingId));
                                })
                              );
    }
    else{
      const url = new FireBase(zHttpAction.BookingDelete);
      const finalUrl = url.finalUrl(bookingId, false);
      console.log("**Delete booking URL: "+finalUrl);
      return this.httpService.delete(finalUrl).pipe(
                                                      switchMap(() => {
                                                        return this.bookings;
                                                      }),
                                                      take(1),
                                                      delay(1000),
                                                      tap(bookings => {
                                                        this._bookings.next(bookings.filter(b => b.id !== bookingId));
                                                      })
                                                    );
    }
  }
}
