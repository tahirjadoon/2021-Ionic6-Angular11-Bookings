import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  //uses reactive forms so create a form
  form: FormGroup;

  constructor() { }

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


  onCreateOffer(){
    if(!this.form.valid){
      return;
    }
    console.log("New offer created");
    console.log(this.form)
  }

}
