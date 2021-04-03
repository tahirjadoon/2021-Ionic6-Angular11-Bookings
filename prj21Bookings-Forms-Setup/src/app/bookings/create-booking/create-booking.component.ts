import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/Utilities/Models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  //get access to the form to do comples date validation, on submit pass in the ref as well. Two ways of working with the form
  @ViewChild('f', {static: true }) form2: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCntrl: ModalController) { }

  ngOnInit() {
    const  avFrom = new Date(this.selectedPlace.availableFrom);
    const  avTo = new Date(this.selectedPlace.availableTo);
    if(this.selectedMode === 'random'){
      //miliseconds to date conversion
      this.startDate = new Date(avFrom.getTime() + Math.random() * (avTo.getTime() - 7 * 24 * 60 * 60 * 10000 - avFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }

  onCancel(){
    //we can pass the id if there are multiple modal open
    this.modalCntrl.dismiss(null, 'cancel');
  }

  onBookPlace(){
    //dismis and pass the modal back
    this.modalCntrl.dismiss( { message: "dummy message" }, 'confirm');
  }

  onSubmit(form: NgForm){
    if(!form.valid || !this.datesValid){
      return;
    }

    //dismis and pass the modal back
    this.modalCntrl.dismiss( { message: {
      firstName: form.value['firstName'],
      lastName: form.value['lastName'],
      guestNumer: form.value['guestNumer'],
      startDate: form.value['dateFrom'],
      endDate: form.value['dateTo']
      } }, 'confirm');
  }

  datesValid(){
    const startDate = new Date(this.form2.value['dateFrom']);
    const endDate = new Date(this.form2.value['dateTo']);
    console.log(startDate, endDate);
    return endDate > startDate;
  }

}
