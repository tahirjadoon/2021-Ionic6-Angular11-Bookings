import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, filter, map, tap, delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

import { Place } from '../Models/place.model';



@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>(
    [
      new Place(
        'p1',
        'Manhattan Mansion',
        'In the heart of New York City.',
        'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
        149.99,
        new Date('2020-01-31'),
        new Date('2021-12-31'),
        'abc'
      ),
      new Place(
        'p2',
        "L'Amour Toujours",
        'A romantic place in Paris!',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
        189.99,
        new Date('2020-01-31'),
        new Date('2021-12-31'),
        'abc'
      ),
      new Place(
        'p3',
        'The Foggy Palace',
        'Not your average city trip!',
        'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
        99.99,
        new Date('2020-01-31'),
        new Date('2021-12-31'),
        'xyz'
      )
    ]
  ) ;

  constructor(private authService: AuthService) { }

  //getter property
  //returns observable now of Place[]
  get places() : Observable<Place[]>{
    //return [...this._places];
    return this._places.asObservable();
  }

  //function to get a single place
  //passing back an observable now as Place
  //place(placeId: string) : Place{
  place(placeId: string): Observable<Place> {

    //return {...this._places.find(x => x.id === placeId )};
    /*
    var localPlace = this.places.pipe(take(1),
                                      map(places => {
                                        return {...places.find(x => x.id === placeId)};
                                      })
                                    );
    return localPlace;
    */
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(p => p.id === placeId) };
      })
    );
  }

  //functions to add Places, function overload will not work in this case since don't have equal number of arguments.
  addPlace(place: Place){
    console.log(place);
    //we cannot push it into the array any more since it is a subject
    //this._places.push(place);
    //instead call the next which emits a new event
    /*
    this.places.pipe(take(1)).subscribe(localPlaces => {
      this._places.next(localPlaces.concat(place));
    });
    */
    //we are showing a spinner so we want to return the state when the code is complete.
    return this.places.pipe(
                            take(1),
                            delay(2000),
                            tap(places => {
                              this._places.next(places.concat(place));
                            })
                          );
  }

  addPlaceManual(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    const newPlace: Place = new Place(Math.random().toString(),
                              title,
                              description,
                              'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
                              price,
                              dateFrom,
                              dateTo,
                              this.authService.userId
                              );
    return this.addPlace(newPlace);
  }

  updatePlace(placeId: string, title: string, description: string){
    return this.places.pipe(
                            take(1),
                            delay(2000),
                            tap(places => {
                              const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
                              const updatedPlaces = [...places];
                              const oldPlace = updatedPlaces[updatedPlaceIndex];
                              updatedPlaces[updatedPlaceIndex] = new Place(
                                                                            oldPlace.id,
                                                                            title,
                                                                            description,
                                                                            oldPlace.imageUrl,
                                                                            oldPlace.price,
                                                                            oldPlace.availableFrom,
                                                                            oldPlace.availableTo,
                                                                            oldPlace.userId
                                                                          );
                              this._places.next(updatedPlaces);
                            })
                          );
  }
}
