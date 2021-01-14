
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiProvider } from './../api/api';

@Injectable()
export class UserProvider {
	device_id: any;
	device_token: string;
	user_id: number;
	email: string;
	name: string;
	short_description: string = '';
	age: number;
	dob: any;
	gender: string;
	status: number;
	occupation: number;
	profile_image: string;
	attribute: any;
	price_range: any = { lower: 20000, upper: 40000 };
	price_range2: any = { lower: 3000000, upper: 5000000 };
	property_type_array: any = [];
	property_type: string;
	search_type: string;
	latitude: any;
	longitude: any;
	city: string;
	state: string;
	country: string;
	hideTabs: boolean = false;
	message_badge: number = 0;
	email_verified: string;
	bedroom: 5;
	bathroom: 5;
	sqm: 150;
	newmatches: any = 0;
	messages: any = 0;
	inappvibrations: any = 0;
	inappsound: any = 0;
	priceRange = {
		"rent": {
			"from": [
				{
					displayValue: "From",
					value: " ",
				},
				{
					displayValue: "0.00",
					valu: "0"
				},
				{
					displayValue: "1,000.00",
					value: "1000"
				},
				{
					displayValue: "2,000.00",
					value: "2000"
				},
				{
					displayValue: "3,000.00",
					value: "3000"
				},
				{
					displayValue: "4,000.00",
					value: "4000"
				},
				{
					displayValue: "5,000.00",
					value: "5000"
				},
				{
					displayValue: "6,000.00",
					value: "6000"
				},
				{
					displayValue: "7,000.00",
					value: "7000"
				},
				{
					displayValue: "8,000.00",
					value: "8000"
				},
				{
					displayValue: "9,000.00",
					value: "9000"
				},
				{
					displayValue: "10,000.00",
					value: "10000"
				},
				{
					displayValue: "15,000.00",
					value: "15000"
				},
				{
					displayValue: "20,000.00",
					value: "20000"
				},
				{
					displayValue: "25,000.00",
					value: "25000"
				},
				{
					displayValue: "30,000.00",
					value: "30000"
				},
				{
					displayValue: "35,000.00",
					value: "35000"
				},
				{
					displayValue: "40,000.00",
					value: "40000"
				},
				{
					displayValue: "45,000.00",
					value: "45000"
				},
				{
					displayValue: "50,000.00",
					value: "50000"
				},
				{
					displayValue: "55,000.00",
					value: "55000"
				},
				{
					displayValue: "60,000.00",
					value: "60000"
				}
			],
			"to": [
				{
					displayValue: "To",
					value: "",
				},
				{
					displayValue: "5,000.00",
					value: "5000"
				},
				{
					displayValue: "6,000.00",
					value: "6000"
				},
				{
					displayValue: "7,000.00",
					value: "7000"
				},
				{
					displayValue: "8,000.00",
					value: "8000"
				},
				{
					displayValue: "9,000.00",
					value: "9000"
				},
				{
					displayValue: "10,000.00",
					value: "10000"
				},
				{
					displayValue: "15,000.00",
					value: "15000"
				},
				{
					displayValue: "20,000.00",
					value: "20000"
				},
				{
					displayValue: "25,000.00",
					value: "25000"
				},
				{
					displayValue: "30,000.00",
					value: "30000"
				},
				{
					displayValue: "35,000.00",
					value: "35000"
				},
				{
					displayValue: "40,000.00",
					value: "40000"
				},
				{
					displayValue: "45,000.00",
					value: "45000"
				},
				{
					displayValue: "50,000.00",
					value: "50000"
				},
				{
					displayValue: "55,000.00",
					value: "55000"
				},
				{
					displayValue: "60,000.00",
					value: "60000"
				},
				{
					displayValue: "65,000.00",
					value: "65000"
				},
				{
					displayValue: "70,000.00",
					value: "70,000.00"
				},
				{
					displayValue: "75,000.00",
					value: "75000"
				},
				{
					displayValue: "80,000.00",
					value: "80000"
				},
				{
					displayValue: "85,000.00",
					value: "85000"
				},
				{
					displayValue: "90,000.00",
					value: "90000"
				},
				{
					displayValue: "95,000.00",
					value: "95000"
				},
				{
					displayValue: "100,000.00",
					value: "100000"
				},
				{
					displayValue: "150,000.00",
					value: "150000"
				},
				{
					displayValue: "200,000.00",
					value: "200000"
				},
				{
					displayValue: "No Limit",
					value: "100000000"
				}
			]
		},
		"sale": {
			"from": [
				{
					displayValue: "From",
					value: " ",
				},
				{
					displayValue: "0.00",
					value: "0",
				},
				{
					displayValue: "500,000.00",
					value: "500000",
				},
				{
					displayValue: "1,000,000.00",
					value: "1000000",
				},
				{
					displayValue: "1,500,000.00",
					value: "1500000"
				},
				{
					displayValue: "2,000,000.00",
					value: "2000000"
				},
				{
					displayValue: "2,500,000.00",
					value: "2500000"
				},
				{
					displayValue: "3,000,000.00",
					value: "3000000"
				},
				{
					displayValue: "3,500,000.00",
					value: "3500000"
				},
				{
					displayValue: "4,000,000.00",
					value: "4000000"
				},
				{
					displayValue: "4,500,000.00",
					value: "4500000"
				},
				{
					displayValue: "5,000,000.00",
					value: "5000000"
				},
				{
					displayValue: "5,500,000.00",
					value: "5500000"
				},
				{
					displayValue: "6,000,000.00",
					value: "6000000"
				},
				{
					displayValue: "6,500,000.00",
					value: "6500000"
				},
				{
					displayValue: "7,000,000.00",
					value: "7000000"
				},
				{
					displayValue: "7,500,000.00",
					value: "7500000"
				},
				{
					displayValue: "8,000,000.00",
					value: "8000000"
				}
			],
			"to": [
				{
					displayValue: "To",
					value: "",
				},
				{
					displayValue: "500,000.00",
					value: "500000",
				},
				{
					displayValue: "1,000,000.00",
					value: "1000000",
				},
				{
					displayValue: "1,500,000.00",
					value: "1500000"
				},
				{
					displayValue: "2,000,000.00",
					value: "2000000"
				},
				{
					displayValue: "2,500,000.00",
					value: "2500000"
				},
				{
					displayValue: "3,000,000.00",
					value: "3000000"
				},
				{
					displayValue: "3,500,000.00",
					value: "3500000"
				},
				{
					displayValue: "4,000,000.00",
					value: "4000000"
				},
				{
					displayValue: "4,500,000.00",
					value: "4500000"
				},
				{
					displayValue: "5,000,000.00",
					value: "5000000"
				},
				{
					displayValue: "5,500,000.00",
					value: "5500000"
				},
				{
					displayValue: "6,000,000.00",
					value: "6000000"
				},
				{
					displayValue: "6,500,000.00",
					value: "6500000"
				},
				{
					displayValue: "7,000,000.00",
					value: "7000000"
				},
				{
					displayValue: "7,500,000.00",
					value: "7500000"
				},
				{
					displayValue: "8,000,000.00",
					value: "8000000"
				},
				{
					displayValue: "9,000,000.00",
					value: "9000000"
				},
				{
					displayValue: "10,000,000.00",
					value: "10000000"
				},
				{
					displayValue: "15,000,000.00",
					value: "15000000"
				},
				{
					displayValue: "20,000,000.00",
					value: "20000000"
				},
				{
					displayValue: "25,000,000.00",
					value: "25000000"
				},
				{
					displayValue: "30,000,000.00",
					value: "30000000"
				},
				{
					displayValue: "35,000,000.00",
					value: "35000000"
				},
				{
					displayValue: "40,000,000.00",
					value: "40000000"
				},
				{
					displayValue: "45,000,000.00",
					value: "45000000"
				},
				{
					displayValue: "50,000,000.00",
					value: "50000000"
				},
				{
					displayValue: "55,000,000.00",
					value: "55000000"
				},
				{
					displayValue: "60,000,000.00",
					value: "60000000"
				},
				{
					displayValue: "65,000,000.00",
					value: "65000000"
				},
				{
					displayValue: "70,000,000.00",
					value: "70000000"
				},
				{
					displayValue: "75,000,000.00",
					value: "75000000"
				},
				{
					displayValue: "80,000,000.00",
					value: "80000000"
				},
				{
					displayValue: "85,000,000.00",
					value: "85000000"
				},
				{
					displayValue: "90,000,000.00",
					value: "90000000"
				},
				{
					displayValue: "No Limit",
					value: "100000000"
				}
			]
		}
	}

	constructor(public http: Http, public api: ApiProvider) { }

	getMessageBadge() {
		return this.message_badge;
	}

	callApi(body: Object, api_name) {
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });
		return this
			.http
			.post(this.api.BASE_URL + api_name, this.makeQueryString(body), options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error));
	}

	makeQueryString(params) {
		var esc = encodeURIComponent;
		var query = Object.keys(params)
			.map(k => esc(k) + '=' + esc(params[k]))
			.join('&');
		return query;
	}
	getCallingCodes() {
		var r = this.http.get('assets/data/CountryCodes.json').map(res => res.json());
		return r;
	}

}
