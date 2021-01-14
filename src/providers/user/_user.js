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
import { Facebook } from '@ionic-native/facebook';
import { ApiProvider } from './../api/api';
var UserProvider = /** @class */ (function () {
    function UserProvider(http, api, fb) {
        this.http = http;
        this.api = api;
        this.fb = fb;
        this.short_description = '';
        this.price_range = { lower: 20000, upper: 40000 };
        this.price_range2 = { lower: 3000000, upper: 5000000 };
        this.property_type_array = [];
        this.hideTabs = false;
        this.message_badge = 0;
        this.newmatches = 0;
        this.messages = 0;
        this.inappvibrations = 0;
        this.inappsound = 0;
        this.priceRange = {
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
        };
    }
    UserProvider.prototype.getMessageBadge = function () {
        return this.message_badge;
    };
    UserProvider.prototype.callApi = function (body, api_name) {
        var bodyString = JSON.stringify(body);
        // console.log(this.api.BASE_URL + api_name, this.makeQueryString(body));
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new RequestOptions({ headers: headers });
        return this
            .http
            .post(this.api.BASE_URL + api_name, this.makeQueryString(body), options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return Observable.throw(error); });
    };
    UserProvider.prototype.makeQueryString = function (params) {
        var esc = encodeURIComponent;
        var query = Object.keys(params)
            .map(function (k) { return esc(k) + '=' + esc(params[k]); })
            .join('&');
        return query;
    };
    UserProvider.prototype.getCallingCodes = function () {
        var r = this.http.get('assets/data/CountryCodes.json').map(function (res) { return res.json(); });
        return r;
    };
    UserProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, ApiProvider, Facebook])
    ], UserProvider);
    return UserProvider;
}());
export { UserProvider };
//# sourceMappingURL=_user.js.map