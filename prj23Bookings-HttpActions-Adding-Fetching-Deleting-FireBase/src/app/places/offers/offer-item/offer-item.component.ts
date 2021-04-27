import { Component, Input, OnInit } from '@angular/core';

import { Place } from '../../../Utilities/Models/place.model';
import { LinksService } from '../../../Utilities/Services/links.service';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {

  @Input() offer: Place;

  constructor(private linksService: LinksService) { }

  ngOnInit() {}

  getDummyDate(){
    return new Date();
  }

  getOfferBookingsLink(id: string): string{
    //'/', 'places', 'tabs', 'offers', 'offer', offer?.id, 'bookings'
    return this.linksService.link_offer_booking(id);
  }

}
