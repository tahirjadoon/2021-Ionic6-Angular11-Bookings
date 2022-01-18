import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router){}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.IsUserAuthenticated){

      const fullPath = segments.reduce((path, currentSegment) => {
        return `${path}/${currentSegment.path}`;
      }, '');

      //this.router.navigate(['/auth']);
      this.router.navigate(['/auth'], {
        queryParams: {
          return: fullPath
        }
      });
    }

    return this.authService.IsUserAuthenticated;
  }

}
