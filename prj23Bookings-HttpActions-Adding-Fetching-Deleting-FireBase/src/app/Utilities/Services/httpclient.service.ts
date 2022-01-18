import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { zHttpAction } from '../Enums/zHttpAction.enum';
import { FireBase } from '../Models/firebase.model';

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  private _retries: number = 0;

  constructor(private httpClient: HttpClient) { }

  get getFireBaseProperties() : FireBase {
    return new FireBase();
  }


  //for passing the params check the following thread, accepted answer
  //https://stackoverflow.com/questions/51885155/httpparams-use-with-put-and-post-change-return-type-to-observablehttpeventt/51889413?noredirect=1#comment90730527_51889413

  /**
   * A GET method
   * @param url api end point
   * @param params pass empty meaning do not pass when not used, will cover stuff like ?x=1&y=2,
   *        instead use HttpParams  pass as { params: { sessionTimeOut: 'y' } } or
   *          const params = new HttpParams().set('id', 1).set('name','tahir');
   *        or as following 3 lines
   *        let params = {};
   *        params['params'] = new HttpParams().set('groupType', this.groupType.toString());
   *        params['observe'] = 'body';
   * @returns returns T string/number/model
   */
  get<T>(url: string, params = {}): Observable<T> {
    return this.httpClient
      .get<T>(url, { params })
      .pipe(retry(this._retries));
  }

  /**
   * A POST method
   * @param url api end point
   * @param body model posting
   * @param params pass empty meaning do not pass when not used, will cover stuff like ?x=1&y=2,
   *        let params = {};
   *        params['params'] = new HttpParams().set('groupType', this.groupType.toString());
   *        params['observe'] = 'body';
   * @returns returns T string/number/model
   */
  post<T>(url: string, body, params = {}): Observable<T> {
    //console.log(url);
    return this.httpClient
      .post<T>(url, body, params)
      .pipe(retry(this._retries));
  }

  /**
   * A PUT method
   * @param url  api end point
   * @param body model posting
   * @param params pass empty meaning do not pass when not used, will cover stuff like ?x=1&y=2,
   *        let params = {};
   *        params['params'] = new HttpParams().set('groupType', this.groupType.toString());
   *        params['observe'] = 'body';
   * @returns returns T string/number/model
   */
  put<T>(url: string, body, params = {}): Observable<T> {
    return this.httpClient
      .put<T>(url, body, params)
      .pipe(retry(this._retries));
  }


  /**
   * A DELETE method
   * @param url  api end point
   * @param params pass empty meaning do not pass when not used, will cover stuff like ?x=1&y=2,
   *        let params = {};
   *        params['params'] = new HttpParams().set('groupType', this.groupType.toString());
   *        params['observe'] = 'body';
   */
  delete(url: string, params = {}): Observable<object> {
    return this.httpClient
      .delete(url, params)
      .pipe(retry(this._retries));
  }

}
