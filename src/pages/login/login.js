var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { NativeStorage } from "@ionic-native/native-storage";
import { Facebook } from "@ionic-native/facebook";
// import { GooglePlus } from "@ionic-native/google-plus";
import { Geolocation } from "@ionic-native/geolocation";
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from "./../../providers/user/user";
import { AlertProvider } from "./../../providers/alert/alert";
import { LoaderProvider } from "./../../providers/loader/loader";
import { TabsPage } from "../../pages/tabs/tabs";
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from "@ngx-translate/core";
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, geolocation, navParams, fb, 
    // private googlePlus: GooglePlus,
    nativeStorage, user, api, alert, loader, fcm, translate, pltform) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.navParams = navParams;
        this.fb = fb;
        this.nativeStorage = nativeStorage;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.fcm = fcm;
        this.pltform = pltform;
        translate.setDefaultLang(localStorage.language);
        this.loginForm = new FormGroup({
            email: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required)
        });
        this.fcm.getToken().then(function (token) {
            _this.deviceToken = token;
        });
        if (this.pltform.is('android')) {
            this.platformType = 'android';
        }
        else if (this.pltform.is('ios')) {
            this.platformType = 'ios';
        }
    }
    /** got tosignup */
    LoginPage.prototype.signup = function () {
        this.navCtrl.setRoot("GetstartedPage");
    };
    /** do signup */
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            password: this.loginForm.value.password,
            email: this.loginForm.value.email,
            //	device_token:this.user.device_id,
            device_token: this.deviceToken,
            device_type: this.platformType
        };
        this.api.post(params, "api/auth/login").subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status === 404) {
                _this.alert.showAlert("Error", data.message);
                _this.navCtrl.setRoot("VerificationNumberPage", {
                    id: data.data.id
                });
            }
            else if (data.status === 200) {
                // this.nativeStorage
                // 	.setItem("user_data", { data: data.data })
                // 	.then(
                // 		() => console.log("Stored item!"),
                // 		error => console.error("Error storing item", error)
                // 	);
                _this.user.user_id = data.data.id;
                _this.user.name = data.data.name;
                _this.user.email = data.data.email;
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
                localStorage.setItem('user_id', data.data.id + '');
                _this.navCtrl.setRoot(TabsPage);
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", "Server not responding");
        });
    };
    /** facebook login */
    LoginPage.prototype.doFacebookLogin = function () {
        var env = this;
        this.fb
            .login(["public_profile", "email"])
            .then(function (res) {
            env.fb
                .api("/me?fields=first_name,last_name,gender,email", [])
                .then(function (user) {
                console.log("user info ", user);
                env.loader.presentLoading();
                var params = {
                    name: user.first_name + ' ' + user.last_name,
                    email: user.id,
                    //	device_token:this.user.device_id,
                    device_token: env.deviceToken,
                    device_type: "android"
                };
                env.user.callApi(params, "social_login").subscribe(function (data) {
                    if (data.status != 0) {
                        localStorage.setItem('user_id', data.data.id + '');
                        env.nativeStorage
                            .setItem("user_data", { data: data.data })
                            .then(function () { return console.log("Stored item!"); }, function (error) { return console.error("Error storing item", error); });
                        env.user.user_id = data.data.id;
                        env.user.name = data.data.name;
                        env.user.short_description = data.data.description;
                        env.user.status = data.data.status;
                        env.user.gender = data.data.gender;
                        env.user.occupation = data.data.occupation;
                        env.user.age = data.data.age;
                        env.user.profile_image = data.data.profile_image;
                        if (data.data.city != null) {
                            env.user.city = data.data.city;
                        }
                        if (data.data.region != null) {
                            env.user.state = data.data.region;
                        }
                        if (data.data.country != null) {
                            env.user.country = data.data.country;
                        }
                        if (data.data.lat != null && data.data.lon != null) {
                            env.user.latitude = data.data.lat;
                            env.user.longitude = data.data.lon;
                        }
                        else {
                            env.getCurrentPosition();
                        }
                        env.loader.dimissLoading();
                        env.alert.showAlert("Message", data.message);
                        env.navCtrl.setRoot(TabsPage);
                        if (data.data.is_verified == 0) {
                            env.navCtrl.setRoot("PhonenumberPage", {
                                id: data.data.id
                            });
                        }
                        else {
                            // this.navCtrl.setRoot(Ta)
                        }
                    }
                    else {
                        env.loader.dimissLoading();
                        env.alert.showAlert("Message", data.message);
                        env.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
                    }
                }, function (err) {
                    env.loader.dimissLoading();
                    console.log(err);
                });
            });
        })
            .catch(function (e) { return console.log("Error logging into Facebook", e); });
    };
    /** do google login */
    LoginPage.prototype.doGoogleLogin = function () {
    };
    /** get current position */
    LoginPage.prototype.getCurrentPosition = function () {
        var _this = this;
        var env = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            console.log("getCurrentPosition", resp);
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
                        console.log(results[1]);
                        console.log("Location: " + results[1].formatted_address);
                    }
                }
            });
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    LoginPage.prototype.goToForgetPassword = function () {
        this.navCtrl.push("forget-password");
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: "page-login",
            templateUrl: "login.html"
        }),
        __metadata("design:paramtypes", [NavController,
            Geolocation,
            NavParams,
            Facebook,
            NativeStorage,
            UserProvider,
            ApiProvider,
            AlertProvider,
            LoaderProvider,
            FCM,
            TranslateService,
            Platform])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map