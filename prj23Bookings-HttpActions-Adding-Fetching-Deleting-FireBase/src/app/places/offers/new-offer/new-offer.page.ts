import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { LinksService } from '../../../Utilities/Services/links.service';
import { PlacesService } from '../../../Utilities/Services/places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  //uses reactive forms so create a form
  form: FormGroup;

  constructor(private placesService: PlacesService,
            private linksService: LinksService,
            private router: Router,
            private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
      description: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(10), Validators.maxLength(180) ]}),
      price: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]}),
      dateFrom: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
      dateTo: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]})
    });
  }

  //safari has issues with numbers so patching it
  //https://stackoverflow.com/questions/48996054/angular-5-validators-pattern-regex-for-only-numbers
  onValidateInput(field){
    this.form.patchValue({[field.id]: this.form.controls[field.id].value});
  }

  getOfferTabLink(): string{
    return this.linksService.link_offers_tab();
  }

  onCreateOffer(){
    if(!this.form.valid){
      return;
    }

    /*
    this.placesService.addPlaceManual(this.form.value.title,
      this.form.value.description,
      +this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo));
    this.form.reset();
    //this.router.navigate(['/places/tabs/offers']);
    this.router.navigate([this.getOfferTabLink()]);
    */

    //we are displaying a spinner so subscrive since the add is returning a observable when it finishes.
    this.loadingCtrl.create({
      keyboardClose: false,
      message: 'Creaeting Place...'
    })
    .then(loadingEl => {
      loadingEl.present();

      //all the form values are string. convert to number by using + and date

        this.placesService.addPlaceManual(this.form.value.title,
          this.form.value.description,
          +this.form.value.price,
          new Date(this.form.value.dateFrom),
          new Date(this.form.value.dateTo)
          )
        .subscribe(() => {

          //dismiss the spinner
          loadingEl.dismiss();

          this.form.reset();
          //this.router.navigate(['/places/tabs/offers']);
          this.router.navigate([this.getOfferTabLink()]);

        });

    });



  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({ keyboardClose: true, message: 'Logging In...' });
    await loading.present();

  }

}
