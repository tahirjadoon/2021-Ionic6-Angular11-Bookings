import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/Utilities/Models/place.model';
import { PlacesService } from 'src/app/Utilities/Services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('placeId')){
        this.navigateToOffers(null);
        return;
      }

      const placeId = parmMap.get('placeId');
      this.place = this.placesService.place(placeId);

      if(!this.place || !this.place.id){
        this.navigateToOffers(placeId);
        return;
      }

      this.initializeForm();
    });
  }

  navigateToOffers(placeId){
    if(!placeId){
      this.navCtrl.navigateBack('/places/tabs/offers');
      return;
    }

    this.navCtrl.navigateBack(['/', 'places', 'tabs', 'offers', 'offer', placeId, 'bookings']);
  }

  initializeForm(){
    this.form = new FormGroup({
      title: new FormControl(this.place.title, {updateOn: 'blur', validators: [Validators.required]}),
      description: new FormControl(this.place.description, {updateOn: 'blur', validators: [Validators.required, Validators.minLength(10), Validators.maxLength(180) ]})
    });
  }

  onEditOffer(){
    if(!this.form.valid){
      return;
    }
    console.log(this.form);
  }

}
