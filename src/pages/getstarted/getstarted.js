var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
// import { GooglePlus } from '@ionic-native/google-plus';
import { Geolocation } from '@ionic-native/geolocation';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TabsPage } from '../../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
var GetstartedPage = /** @class */ (function () {
    function GetstartedPage(navCtrl, navParams, nativeStorage, geolocation, fb, 
    // private googlePlus: GooglePlus,
    user, alert, loader, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.nativeStorage = nativeStorage;
        this.geolocation = geolocation;
        this.fb = fb;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        translate.setDefaultLang(localStorage.language);
    }
    GetstartedPage.prototype.ionViewWillEnter = function () { this.user.hideTabs = true; };
    /** go to login page */
    GetstartedPage.prototype.login = function () {
        this.navCtrl.setRoot("LoginPage");
    };
    /** got tosignup */
    GetstartedPage.prototype.signup = function () {
        this.navCtrl.setRoot("SignupPage");
    };
    /** facebook login */
    GetstartedPage.prototype.doFacebookLogin = function () {
        var env = this;
        this.fb.login(['public_profile', 'email'])
            .then(function (res) {
            console.log('Logged into Facebook!', res);
            env
                .fb
                .api("/me?fields=first_name,last_name,gender,email", [])
                .then(function (user) {
                console.log("user info ", user);
                env.loader.presentLoading();
                var params = {
                    name: user.first_name + ' ' + user.last_name,
                    email: user.id,
                    // "device_token":this.user.device_id,
                    device_token: env.deviceToken,
                    "device_type": "android"
                };
                env.user.callApi(params, 'social_login').subscribe(function (data) {
                    console.log(data);
                    env.loader.dimissLoading();
                    if (data.status != 0) {
                        localStorage.setItem('user_id', data.data.id + '');
                        env.nativeStorage.setItem('user_data', { data: data.data })
                            .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
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
                        env.alert.showAlert('Message', data.message);
                        env.navCtrl.setRoot(TabsPage);
                        if (data.data.is_verified == 0) {
                            // env.loader.dimissLoading();
                            env.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
                        }
                        else {
                            // this.navCtrl.setRoot(Ta)
                        }
                    }
                    else {
                        env.alert.showAlert('Message', data.message);
                        env.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
                    }
                }, function (err) {
                    env.loader.dimissLoading();
                    console.log(err);
                });
            });
        })
            .catch(function (e) { return console.log('Error logging into Facebook', e); });
    };
    /** do google login */
    GetstartedPage.prototype.doGoogleLogin = function () {
        // var env = this;
        // this.googlePlus.login({
        // 	webClientId: "174552102740-loqljpiq2snr9g3bs0b05at198qi2i8o.apps.googleusercontent.com",
        // 	scopes: 'https://www.googleapis.com/auth/plus.login'
        // })
        // 	.then(res => {
        // 		this.loader.presentLoading()
        // 		let params = {
        // 			name: res.displayName,
        // 			email: res.userId,
        // 			device_token: env.deviceToken,
        // 			//  "device_token":this.user.device_id,
        // 			"device_type": "android"
        // 		}
        // 		env.user.callApi(params, 'social_login').subscribe(data => {
        // 			console.log(data);
        // 			this.loader.dimissLoading();
        // 			if (data.status != 0) {
        // 				env.nativeStorage.setItem('user_data', { data: data.data })
        // 					.then(
        // 						() => console.log('Stored item!'),
        // 						error => console.error('Error storing item', error)
        // 					);
        // 				env.user.user_id = data.data.id;
        // 				env.user.name = data.data.name;
        // 				env.user.short_description = data.data.description;
        // 				env.user.status = data.data.status;
        // 				env.user.gender = data.data.gender;
        // 				env.user.occupation = data.data.occupation;
        // 				env.user.age = data.data.age;
        // 				env.user.profile_image = data.data.profile_image;
        // 				if (data.data.city != null) {
        // 					env.user.city = data.data.city;
        // 				}
        // 				if (data.data.region != null) {
        // 					env.user.state = data.data.region;
        // 				}
        // 				if (data.data.country != null) {
        // 					env.user.country = data.data.country;
        // 				}
        // 				if (data.data.lat != null && data.data.lon != null) {
        // 					env.user.latitude = data.data.lat;
        // 					env.user.longitude = data.data.lon;
        // 				} else {
        // 					env.getCurrentPosition();
        // 				}
        // 				env.alert.showAlert('Message', data.message);
        // 				env.navCtrl.setRoot(TabsPage);
        // 				if (data.data.is_verified == 0) {
        // 					this.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
        // 				} else {
        // 					// this.navCtrl.setRoot(Ta)
        // 				}
        // 			} else {
        // 				// this.alert.showAlert('Message', data.message);
        // 				this.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
        // 			}
        // 		}, err => {
        // 			this.loader.dimissLoading();
        // 			console.log(err);
        // 		})
        // 	})
        // 	.catch(err => console.error(err));
    };
    /** get current position */
    GetstartedPage.prototype.getCurrentPosition = function () {
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
                    // env.setRootPage();
                }
                //env.setRootPage();
            });
            //  this.setRootPage();
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    GetstartedPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-getstarted',
            templateUrl: 'getstarted.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            NativeStorage,
            Geolocation,
            Facebook,
            UserProvider,
            AlertProvider,
            LoaderProvider,
            TranslateService])
    ], GetstartedPage);
    return GetstartedPage;
}());
export { GetstartedPage };
//# sourceMappingURL=getstarted.js.map