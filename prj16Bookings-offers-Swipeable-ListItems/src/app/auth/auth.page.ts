import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Utilities/Services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  returnUrl : string = "";

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      const myReturnUrl = params["return"];
      if(myReturnUrl){
        this.returnUrl = myReturnUrl;
      }
      console.log(myReturnUrl);
    });

    /*
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navigateToBookings();
        return;
      }

      const placeId = paramMap.get('placeId');
      this.place = this.placesService.place(placeId);

      if(!this.place || !this.place.id){
        this.navigateToBookings();
        return;
      }

    });
    */
  }

  onLogin(){
    this.authService.logIn();

    console.log(this.returnUrl);

    if(this.returnUrl === '')
      this.router.navigateByUrl('/');
    else
      this.router.navigateByUrl(this.returnUrl);
  }
}
