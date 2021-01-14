var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
var ApiProvider = /** @class */ (function () {
    function ApiProvider(http) {
        this.http = http;
        this.BASE_URL = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel/public/';
        this.API = 'http://localhost:8888/';
        this.IMAGE_URL = 'http://rentbuydirect.ddit-serv1.com/property-match-api-laravel';
        // this.BASE_URL = 'http://localhost/property-match-backend/property/';
        // this.IMAGE_URL = 'http://localhost/property-match-backend';
    }
    ApiProvider.prototype.get = function (body, api_name) {
        var bodyString = JSON.stringify(body);
        var headers = new Headers({
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({
            headers: headers,
            params: body
        });
        return this
            .http
            .get(this.API + api_name, options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error); });
    };
    ApiProvider.prototype.post = function (body, api_name) {
        var bodyString = JSON.stringify(body);
        var headers = new Headers({
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this
            .http
            .post(this.API + api_name, body, options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error); });
    };
    ApiProvider.prototype.put = function (body, api_name) {
        var bodyString = JSON.stringify(body);
        var headers = new Headers({
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this
            .http
            .put(this.API + api_name, body, options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error); });
    };
    ApiProvider.prototype.delete = function (api_name) {
        var headers = new Headers({
            'Content-Type': 'application/json'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this
            .http
            .delete(this.API + api_name)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error); });
    };
    ApiProvider.prototype.makeQueryString = function (params) {
        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(function (k) { return esc(k) + '=' + esc(params[k]); })
            .join('&');
        return query;
    };
    ApiProvider.prototype.callGetApi = function (api_name) {
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });
        return this
            .http
            .get(this.BASE_URL + api_name, options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); });
    };
    ApiProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], ApiProvider);
    return ApiProvider;
}());
export { ApiProvider };
//# sourceMappingURL=api.js.map
