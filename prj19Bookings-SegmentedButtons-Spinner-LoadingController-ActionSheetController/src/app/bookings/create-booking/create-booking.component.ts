import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/Utilities/Models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;


  constructor(private modalCntrl: ModalController) { }

  ngOnInit() {}

  onCancel(){
    //we can pass the id if there are multiple modal open
    this.modalCntrl.dismiss(null, 'cancel');
  }

  onBookPlace(){
    //dismis and pass the modal back
    this.modalCntrl.dismiss( { message: "dummy message" }, 'confirm');
  }

}
