import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { zDatabaseMode } from './Utilities/Enums/zHttpAction.enum';

import { FireBase } from './Utilities/Models/firebase.model';

import { AuthService } from './Utilities/Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    console.log("********* DatabaseMode *********")
    var appModes: string[] = [];
    for(var n in zDatabaseMode) {
      if(typeof zDatabaseMode[n] === 'number') appModes.push(n);
    }
    console.log("available app modes: " + this.getStringValuesFromEnum(zDatabaseMode));
    console.log("appStoreMode: " + zDatabaseMode[FireBase.appStoreMode] + " (" +  FireBase.appStoreMode + ")");
    console.log("isAappStoreModeDatabaseAndLocal: " + FireBase.isAappStoreModeDatabaseAndLocal);
    console.log("isAppStoreModeDatabase: " + FireBase.isAppStoreModeDatabase);
    console.log("isAppStoreModeLocal: " + FireBase.isAppStoreModeLocal);
    console.log("hasAppStoreModeDatabase: " + FireBase.hasAppStoreModeDatabase);
    console.log("hasAppStoreModeLocal: " + FireBase.hasAppStoreModeLocal);
    console.log("********************************")
  }

  getStringValuesFromEnum<T>(myEnum: T): (keyof T)[] {
    return Object.keys(myEnum).filter(k => typeof (myEnum as any)[k] === 'number') as any;
  }

  onLogOut(){
    this.authService.logOut();
    this.router.navigateByUrl('/auth');
  }

}
