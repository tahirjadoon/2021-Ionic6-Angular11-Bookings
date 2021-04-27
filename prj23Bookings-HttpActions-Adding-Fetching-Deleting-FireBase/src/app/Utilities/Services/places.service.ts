import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, filter, map, tap, delay, switchMap } from 'rxjs/operators';

import { zDatabaseMode, zHttpAction } from '../Enums/zHttpAction.enum';

import { FireBase } from '../Models/firebase.model';
import { Place } from '../Models/place.model';

import { IPlaceDataFireBase } from '../Interfaces/placedatafirebase.interface';

import { AuthService } from './auth.service';
import { DummyDataService } from './dummyData.service';
import { HttpclientService } from './httpclient.service';



@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private dummyService: DummyDataService, private authService: AuthService, private httpService: HttpclientService) { }

  private _places = new BehaviorSubject<Place[]>( this.dummyService.populatePlaces() ) ;

  //getter property
  //returns observable now of Place[]
  get places() : Observable<Place[]>{
    //return [...this._places];
    return this._places.asObservable();
  }

  fetchPlaces(){
    const url = new FireBase(zHttpAction.PlacesFetch);
    //return object is per the firebase return data structure so created an interface
    return this.httpService.get<{[key: string]: IPlaceDataFireBase}>(url.finalUrl()).pipe(
                                                                                          delay(1000),
                                                                                          map(resData => {
                                                                                            const fetchedPlaces: Place[] = [];
                                                                                            for(const key in resData){
                                                                                              if(resData.hasOwnProperty(key)){
                                                                                                fetchedPlaces.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl, +resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId));
                                                                                              }
                                                                                            }
                                                                                            return fetchedPlaces;
                                                                                            //return [];
                                                                                          }),
                                                                                          tap(fetchedPlaces => {
                                                                                            this._places.next(fetchedPlaces);
                                                                                          })
                                                                                        );
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
    if(FireBase.isAppStoreModeLocal){
      return this.places.pipe(
        take(1),
        delay(1000),
        map(places => {
          return { ...places.find(p => p.id === placeId) };
        })
      );
    }
    else{
      const url = new FireBase(zHttpAction.PlaceUpdate);
      console.log("** places: " + url.finalUrl(placeId, false));

      return this.httpService.get<IPlaceDataFireBase>(url.finalUrl(placeId, false)).pipe(
                                                                    delay(1000),
                                                                    map(resData => {
                                                                      return new Place(placeId, resData.title, resData.description, resData.imageUrl, resData.price, new Date(resData.availableFrom), new Date(resData.availableTo), resData.userId);
                                                                    })
                                                                  );
    }
  }

  //functions to add Places, function overload will not work in this case since don't have equal number of arguments.
  addPlace(place: Place){
    console.log("Adding Place: ", place);
    //we cannot push it into the array any more since it is a subject
    //this._places.push(place);
    //instead call the next which emits a new event
    /*
    this.places.pipe(take(1)).subscribe(localPlaces => {
      this._places.next(localPlaces.concat(place));
    });
    */
    //we are showing a spinner so we want to return the state when the code is complete.
    if(FireBase.isAppStoreModeLocal){
      return this.places.pipe(
                              take(1),
                              delay(2000),
                              tap(places => {
                                this._places.next(places.concat(place));
                              })
                            );
    }
    else{
      let generatedId: string = "";
      const url = new FireBase(zHttpAction.PlaceAdd);
      return this.httpService.post<{name: string}>(url.finalUrl(), {...place})
                          .pipe(
                            //tap(responseData => {
                            //  console.log("Place Added Response: ", responseData);
                            //}),
                            switchMap(resData => {
                              //console.log("Place Added Response: ", resData);
                              generatedId = resData.name;
                              return this.places;
                            }),
                            take(1),
                            tap(places => {
                              if(FireBase.hasAppStoreModeLocal){
                                place.id = generatedId;
                                this._places.next(places.concat(place));
                              }
                              else{
                                this._places.next(places);
                              }
                            })
                          );
    }

  }

  addPlaceManual(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    const newPlace: Place = new Place( FireBase.hasAppStoreModeDatabase ? null : Math.random().toString(),
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
    if(FireBase.isAppStoreModeLocal){
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
    else{
      //get the current place and then do the
      let updatedPlaces: Place[] = [];
      return this.places.pipe(
                                          take(1),
                                          delay(1000),
                                          switchMap(places => {
                                            if(!places || places.length <= 0){
                                              return this.fetchPlaces();
                                            }
                                            else{
                                              return of(places);
                                            }
                                          }),
                                          switchMap(places => {
                                            const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
                                            updatedPlaces = [...places];
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
                                            const url = new FireBase(zHttpAction.PlaceUpdate);
                                            //console.log(url.finalUrl(placeId, false));
                                            return this.httpService.put(url.finalUrl(placeId, false), {...updatedPlaces[updatedPlaceIndex], id:null});
                                          }),
                                          tap(() => {
                                            this._places.next(updatedPlaces);
                                          })
                                        );
    }
  }
}
