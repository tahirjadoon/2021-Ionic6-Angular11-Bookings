import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor() { }

  link_offers_tab(): string{
    return '/places/tabs/offers';
  }

  link_offer_new():string{
    return `/places/tabs/offers/new`;
  }

  link_offer_edit(id: string):string{
    return `/places/tabs/offers/edit/${id}/offer`;
  }

  link_offer_booking(id: string): string{
    return `/places/tabs/offers/offer/${id}/bookings`;
  }

  link_discover_tab(): string{
    return '/places/tabs/discover';
  }

  link_discover_place_detail(id: string): string{
    return `/places/tabs/discover/place/${id}/detail`;
  }

  link_bookings(): string{
    return '/bookings';
  }

}
