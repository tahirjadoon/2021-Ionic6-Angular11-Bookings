import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../Utilities/Services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  returnUrl : string = "";
  isLoading = false;
  isLoginMode = true;

  /*
  non overlay spinneris plain and simnple. Don't need to do any thing
  for the overlay spinner we'll need to inject the controller
  */

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private loadingCtrl: LoadingController) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      const myReturnUrl = params["return"];
      if(myReturnUrl){
        console.log("inside");
        this.returnUrl = myReturnUrl;
      }
      console.log("returnUrl:" + this.returnUrl );
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
    this.isLoading = true;

    //only in case of overlay spinner
    this.presentLoading();

    this.authService.logIn();

    console.log(this.returnUrl);

    //redirect after 2 seconds
    //only in case of non iverlay spinner
    /*
    setTimeout(() => {
      this.isLoading = false;
      this.redirect();
    }, 2000);
    */
  }

   redirect(){
    if(this.returnUrl === '')
      this.router.navigateByUrl('/');
    else
      this.router.navigateByUrl(this.returnUrl);
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({ keyboardClose: true, message: 'Logging In...' });
    await loading.present();

    setTimeout(() => {
      this.isLoading = false;
      loading.dismiss();
      this.redirect();
    }, 3000);

  }

  onSwitchToAuthMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    //return, not valid
    if(!form.valid){
      return;
    }
    //get form values
    const email = form.value.email;
    const password = form.value.password;
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    //check mode
    if(this.isLoginMode){
      this.doLogin(email, password);
    }
    else{
      this.doSignUp(email, password);
    }
  }

  async doLogin(email: string, password: string){
    this.isLoading = true;

    //only in case of overlay spinner
    const loading = await this.loadingCtrl.create({ keyboardClose: true, message: 'Logging In...' });
    await loading.present();

    setTimeout(() => {
      this.isLoading = false;
      loading.dismiss();
      this.redirect();

      this.authService.logIn();
      console.log(this.returnUrl);
    }, 5000);
  }

  async doSignUp(email: string, password: string){

  }


}
