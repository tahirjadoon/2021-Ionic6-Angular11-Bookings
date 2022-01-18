import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = true;
  private _userId = 'abc';

  constructor() { }

  get IsUserAuthenticated() {
    return this._isUserAuthenticated;
  }

  get userId(){
    return this._userId;
  }

  logIn(){
    this._isUserAuthenticated = true;
  }

  logOut(){
    this._isUserAuthenticated = false;
  }

}
