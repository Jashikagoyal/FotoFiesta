import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  responseData: any;
  event_list: any[] = [];
  activeSubscription: any[] = [];
  private _activeSubscriptionSubject = new BehaviorSubject<any[]>([]);
  activeSubscription$ = this._activeSubscriptionSubject.asObservable();

  set setUserDataInitial(response_data: any) {
    // console.log(" reponse data from Service" ,response_data)
    this.responseData = response_data
    this.event_list = response_data.my_events
    // console.log("event List from service",this.event_list)
    // this.activeSubscription = response_data.subscription
    this.activeSubscription = Array.isArray(this.responseData.subscription)
              ? this.responseData.subscription
              : [this.responseData.subscription];
    console.log("subscription from service",this.activeSubscription)
  }
  userData() {
    const requestOptions = GetHeaders();
    console.log(requestOptions)
    this.httpClient
      .get(
        'http://localhost:8000/users/get-user-data/',
        requestOptions
      )
      .subscribe(
        (response) => {
          if (response) {

            this.responseData = response
            // console.log(" reponse data from Service", this.responseData)

            this.event_list = this.responseData.my_events
            // console.log("event List from service", this.event_list)
            this.activeSubscription = Array.isArray(this.responseData.subscription)
              ? this.responseData.subscription
              : [this.responseData.subscription];
            // this.activeSubscription = this.responseData.subscription
            // console.log("subscription from service", this.activeSubscription)
            this._activeSubscriptionSubject.next(this.activeSubscription);
            
          }
          // Handle the server's response
        },
        (error) => {
          // Handle any errors
        }
      );
  }
}
function GetHeaders() {
  const headerDict = {
    Authorization: 'Token ' + localStorage.getItem('authToken'),
    'Content-Type': 'application/json',
  };

  const requestOptions = {
    headers: new HttpHeaders(headerDict),
  };
  return requestOptions;
}