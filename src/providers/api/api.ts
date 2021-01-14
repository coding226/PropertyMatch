	import { Http, Response, Headers, RequestOptions } from '@angular/http';
	import { Injectable } from '@angular/core';
	import { Observable } from 'rxjs/Rx';
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/catch';

	@Injectable()
	export class ApiProvider {
		BASE_URL: string;
		API: string;
		IMAGE_URL: string;
		IMAGE_UPLOAD_API: string;
		constructor(public http: Http) {
			this.BASE_URL = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel/public/';
			this.API = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel/public/';
			this.IMAGE_URL = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel';
			this.IMAGE_UPLOAD_API = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel/public/';
		}

		get(body: Object, api_name) {
			let headers = new Headers({
				// 'Content-Type': 'application/json'
			});
			let options = new RequestOptions({
				headers: headers,
				params: body
			});
			return this
			.http
			.get(this.API + api_name, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error));
		}

		post(body: Object, api_name) {
			let headers = new Headers({
				'Content-Type': 'application/json'
			});
			let options = new RequestOptions({
				headers: headers
			});
			return this
			.http
			.post(this.API + api_name, body, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error));
		}

		put(body: Object, api_name) {
			let headers = new Headers({
				'Content-Type': 'application/json'
			});
			let options = new RequestOptions({
				headers: headers
			});
			return this
			.http
			.put(this.API + api_name, body, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error));
		}

		delete( api_name) {
			return this
			.http
			.delete(this.API + api_name)
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

		callGetApi(api_name) {
			let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
			let options = new RequestOptions({ headers: headers });

			return this
			.http
			.get(this.BASE_URL + api_name, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
		}
	}
