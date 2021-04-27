import { ConditionalExpr } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../../Utilities/Models/place.model';

import { LinksService } from '../../../Utilities/Services/links.service';
import { PlacesService } from '../../../Utilities/Services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isError: boolean = false;
  placeId: string = "";
  place: Place;
  form: FormGroup;
  private placeSubscription: Subscription;
  private addPlaceSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private navCtrl: NavController,
              private placesService: PlacesService,
              private linksService: LinksService,
              private router: Router,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('placeId')){
        this.navigateToOffers(null);
        return;
      }

      const placeId = parmMap.get('placeId');
      this.placeId = placeId;
      //this.place = this.placesService.place(placeId);
      //subscription
      this.isLoading = true;
      this.placeSubscription = this.placesService.place(placeId).subscribe(place => {

        this.place = place;

        if(!this.place || !this.place.id){
          this.navigateToOffers(null);
          return;
        }

        this.initializeForm();

        this.isLoading = false;
      },
      error => {
        console.log(1);
        this.isLoading = false;
        this.isError = true;
        this.alertCtrl.create({
                                header: 'An error occured!',
                                message: "Place could not be fetched, try again later. ",
                                buttons: [
                                  {
                                    text: "Ok",
                                    handler: () => {
                                      this.navigateToOffers(null);
                                    }
                                  }
                                ]
                              })
                        .then(alertEl => {
                          alertEl.present();
                        });
      });

    });
  }

  navigateToOffers(placeId){
    if(!placeId){
      //this.navCtrl.navigateBack('/places/tabs/offers');
      this.navCtrl.navigateBack(this.linksService.link_offers_tab());
      return;
    }
    //this.navCtrl.navigateBack(['/', 'places', 'tabs', 'offers', 'offer', placeId, 'bookings']);
    this.navCtrl.navigateBack([this.getLinkOfferBookings(placeId)]);
  }

  getLinkOfferBookings(placeId):string{
    //'/', 'places', 'tabs', 'offers', 'offer', placeId, 'bookings'
    return this.linksService.link_offer_booking(placeId);
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
    this.loadingCtrl.create({
      keyboardClose: false,
      message: "Updating place..."
    }).then(loadingEl => {
      loadingEl.present();
      //update place here
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        console.log("updated");
        //this.navigateToOffers(null);
        this.router.navigate([this.linksService.link_offers_tab()]);
      });
    });

  }

  ngOnDestroy(){
    if(this.placeSubscription){
      this.placeSubscription.unsubscribe();
    }
    if(this.addPlaceSubscription){
      this.addPlaceSubscription.unsubscribe();
    }
  }

}
