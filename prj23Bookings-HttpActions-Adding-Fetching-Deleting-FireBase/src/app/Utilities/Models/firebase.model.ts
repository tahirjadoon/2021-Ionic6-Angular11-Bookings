import { zDatabaseMode, zHttpAction } from "../Enums/zHttpAction.enum";

export class FireBase {

  //app wise app store mode
  private static _appStoreMode: zDatabaseMode = zDatabaseMode.Database;

  public static get appStoreMode(): zDatabaseMode{
    return this._appStoreMode;
  };
  public static get isAppStoreModeDatabase(): boolean{
    return this._appStoreMode === zDatabaseMode.Database;
  }
  public static get isAappStoreModeDatabaseAndLocal(): boolean{
    return this._appStoreMode === zDatabaseMode.DatabaseAndLocal;
  }
  public static get isAppStoreModeLocal(): boolean{
    return this._appStoreMode === zDatabaseMode.Local;
  }
  public static get hasAppStoreModeDatabase(): boolean {
    return this.isAappStoreModeDatabaseAndLocal || this.isAppStoreModeDatabase;
  }
  public static get hasAppStoreModeLocal(): boolean{
    return this.isAappStoreModeDatabaseAndLocal || this.isAppStoreModeLocal;
  }

  //fire base param
  private _fbBaseUrl: string = "";
  private _fbProjectName: string = "Ionic6-Ng11-Bookings";
  private _fbProjectId: string = "ionic6-ng11-bookings";
  private _fbProjectNumber: string = "360447610254";
  private _fbWebApiKey: string = "";

  /*
  private _fbBaseUrl: string = "";
  private _fbProjectName: string = "";
  private _fbProjectId: string = "";
  private _fbProjectNumber: string = "";
  private _fbWebApiKey: string = "";
  */

  //fire base end point
  private _endpoint_OfferedPlaces: string = "offered-places";
  private _endpoint_bookings: string = "bookings";

  //when creating the instance providing for what end point, final url uses this
  private _zHttpAction: zHttpAction = zHttpAction.None;

  constructor(httpAction?: zHttpAction){
    if(httpAction){
      this._zHttpAction = httpAction;
    }
  }

  get baseUrl(): string{
    return this._fbBaseUrl;
  }

  get projectName(): string{
    return this._fbProjectName;
  }

  get projectId(): string{
    return this._fbProjectId;
  }

  get projectNumber(): string{
    return this._fbProjectNumber;
  }

  get webApiKey(): string{
    return this._fbWebApiKey;
  }

  finalUrl(paramsAppenedToFinalUrl?:string, appendAfterBaseUrl?:boolean): string{
    let url: string = this.getEndPoint();
    url = this.buildBaseUrl(url, paramsAppenedToFinalUrl, appendAfterBaseUrl);
    if(url && url !== ""){
      url = `${url}.json`; //.json is due to the firebase
    }
    return url;
  }

  finalUrlWithQueryString(paramsAppenedToFinalUrl?:string, appendAfterBaseUrl?:boolean, queryString?:string): string{
    let url: string = this.getEndPoint();
    url = this.buildBaseUrl(url, paramsAppenedToFinalUrl, appendAfterBaseUrl);
    if(url && url !== ""){
      url = `${url}.json`; //.json is due to the firebase
      if(queryString && queryString.trim() !== ""){
        url = `${url}?${queryString}`;
      }
    }
    return url;
  }

  private getEndPoint():string{
    let url: string = "";
    switch(this._zHttpAction){
      case zHttpAction.PlaceAdd:
      case zHttpAction.PlacesFetch:
      case zHttpAction.PlaceUpdate:
      case zHttpAction.PlaceFetch: {
        url = `${this._endpoint_OfferedPlaces}`;
        break;
      }
      case zHttpAction.BookingsAdd:
      case zHttpAction.BookingsFetch:
      case zHttpAction.BookingDelete:{
        url = `${this._endpoint_bookings}`;
        break;
      }
    }
    return url;
  }

  private buildBaseUrl(url: string, paramsAppenedToFinalUrl?:string, appendAfterBaseUrl?:boolean) : string{
    let baseUrl = this.baseUrl;
    if(url && url !== ""){
      if(!paramsAppenedToFinalUrl || paramsAppenedToFinalUrl === ""){
        paramsAppenedToFinalUrl = "";
      }
      else{
        if (!!appendAfterBaseUrl){
          appendAfterBaseUrl = true;
        }

        if(appendAfterBaseUrl){
          baseUrl += paramsAppenedToFinalUrl;
          if(!paramsAppenedToFinalUrl.endsWith("/")){
            baseUrl += "/";
          }
        }
        else{
          if(!paramsAppenedToFinalUrl.startsWith("/")){
            url += "/";
          }
          url += paramsAppenedToFinalUrl
        }
      }
      url = `${baseUrl}${url}`;
    }
    return url;
  }

}
