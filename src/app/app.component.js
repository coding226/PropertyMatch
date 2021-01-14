var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { TabsPage } from '../pages/tabs/tabs';
import { UserProvider } from '../providers/user/user';
import { AlertProvider } from '../providers/alert/alert';
import { LoaderProvider } from '../providers/loader/loader';
import { ApiProvider } from '../providers/api/api';
import { ViewChild } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from '@ngx-translate/core';
var MyApp = /** @class */ (function () {
    function MyApp(translate, events, fcm, platform, statusBar, splashScreen, geolocation, nativeStorage, user, api, alert, loader) {
        var _this = this;
        this.translate = translate;
        this.events = events;
        this.fcm = fcm;
        this.platform = platform;
        this.geolocation = geolocation;
        this.nativeStorage = nativeStorage;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        platform.ready().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        statusBar.styleDefault();
                        splashScreen.hide();
                        return [4 /*yield*/, this.proeprtyType()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAttributes()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setRootPage()];
                    case 3:
                        _a.sent();
                        this.loader.readDevicestate();
                        this.platform.pause.subscribe(function () {
                        });
                        this.platform.resume.subscribe(function () {
                            _this.handleNoti();
                        });
                        this.handleNoti();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    MyApp.prototype.ngOnInit = function () {
        // TODO set default translate language
        if (!localStorage.language) {
            localStorage.setItem("language", "en");
        }
        this.translate.setDefaultLang(localStorage.language);
    };
    MyApp.prototype.handleNoti = function () {
        var _this = this;
        this.fcm.getToken().then(function (token) {
            _this.deviceToken = token;
            // alert('FCM Token =>' + token);
        });
        this.fcm.onNotification().subscribe(function (data) {
            var noti = JSON.parse(JSON.stringify(data));
            var notiData = JSON.parse(noti.data);
            if (data.wasTapped) {
                // alert('Tapped')
                _this.events.publish('notification clicked', 2);
            }
            else {
                if (parseInt(notiData.receiver_id) === parseInt(_this.user.user_id + '')) {
                    _this.events.publish('NEWMESSAGE');
                    _this.events.publish("MESSAGE:RECIEVED", data);
                }
            }
            ;
        });
    };
    MyApp.prototype.setRootPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!localStorage.user_id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.user.callApi({
                                user_id: localStorage.user_id
                            }, 'get_user_data').subscribe(function (data) {
                                _this.user.callApi;
                                _this.user.user_id = data.data.id;
                                _this.user.email = data.data.email; // dob
                                _this.user.name = data.data.name;
                                _this.user.short_description = data.data.description;
                                _this.user.status = data.data.status;
                                _this.user.gender = data.data.gender;
                                _this.user.occupation = data.data.occupation;
                                _this.user.age = data.data.age;
                                _this.user.profile_image = data.data.profile_image;
                                _this.user.email_verified = data.data.email_verified;
                                _this.user.newmatches = data.data.newmatches;
                                _this.user.messages = data.data.messages;
                                _this.user.inappvibrations = data.data.inappvibrations;
                                _this.user.inappsound = data.data.inappsound;
                                _this.user.bedroom = data.data.bedroom;
                                _this.user.bathroom = data.data.bathroom;
                                _this.user.studio = data.data.studio;
                                _this.user.sqm = data.data.sqm;
                                _this.user.rent_duration = data.data.rent_duration;
                                _this.user.property_type = data.data.property_type;
                                if (data.data.city != null) {
                                    _this.user.city = data.data.city;
                                }
                                if (data.data.region != null) {
                                    _this.user.state = data.data.region;
                                }
                                if (data.data.country != null) {
                                    _this.user.country = data.data.country;
                                }
                                if (data.data.lat != null && data.data.lon != null) {
                                    _this.user.latitude = data.data.lat;
                                    _this.user.longitude = data.data.lon;
                                }
                                else {
                                    _this.getCurrentPosition();
                                }
                                _this.rootPage = TabsPage;
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('ChooseLanguagePage');
                        this.rootPage = "ChooseLanguagePage";
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** get attribute */
    MyApp.prototype.getAttributes = function () {
        var env = this;
        return new Promise(function (resolve, reject) {
            env.api.callGetApi('attributes').subscribe(function (res) {
                env.user.attribute = res.data;
                env.user.attribute.map(function (x) {
                    x.checked = false;
                });
                resolve(true);
            }, function (err) {
            });
        });
    };
    /** get property type */
    MyApp.prototype.proeprtyType = function () {
        var env = this;
        return new Promise(function (resolve, reject) {
            env.api.callGetApi('property_type').subscribe(function (res) {
                env.user.property_type_array = res.data;
                resolve(true);
            }, function (err) {
            });
        });
    };
    /** get current position */
    MyApp.prototype.getCurrentPosition = function () {
        var _this = this;
        var env = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            // console.log("getCurrentPosition", resp);
            _this.user.latitude = resp.coords.latitude;
            _this.user.longitude = resp.coords.longitude;
            var lat = _this.user.latitude;
            var lng = _this.user.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var a = results[1].address_components;
                    console.log(a);
                    env.user.city = a[1].short_name;
                    env.user.state = a[2].long_name;
                    env.user.country = a[3].long_name;
                    if (results[1]) {
                    }
                    // env.setRootPage();
                }
                //env.setRootPage();
            });
            //  this.setRootPage();
        }).catch(function (error) {
        });
    };
    __decorate([
        ViewChild('MyApp'),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            template: '<ion-nav [root]="rootPage"></ion-nav>'
        }),
        __metadata("design:paramtypes", [TranslateService, Events, FCM, Platform, StatusBar, SplashScreen, Geolocation, NativeStorage, UserProvider, ApiProvider, AlertProvider, LoaderProvider])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map