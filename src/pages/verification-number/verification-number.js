var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TabsPage } from '../../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the VerificationNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VerificationNumberPage = /** @class */ (function () {
    function VerificationNumberPage(api, translate, navCtrl, ref, geolocation, navParams, nativeStorage, user, alert, loader) {
        this.api = api;
        this.navCtrl = navCtrl;
        this.ref = ref;
        this.geolocation = geolocation;
        this.navParams = navParams;
        this.nativeStorage = nativeStorage;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.counter = 60;
        this.tick = 1000;
        translate.setDefaultLang(localStorage.language);
    }
    VerificationNumberPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad VerificationNumberPage');
        this.countDown = Observable.timer(0, this.tick)
            .take(this.counter)
            .map(function () { return --_this.counter; });
    };
    /** set focus */
    VerificationNumberPage.prototype.setfocus = function (value) {
        switch (value) {
            case 'inputSecond':
                this.input2.nativeElement.focus();
                // this.ref.detectChanges();
                break;
            case 'inputThird':
                this.input3.nativeElement.focus();
                // setTimeout(() => {
                //   this.ref.detectChanges();
                // }, 0);
                break;
            case 'inputFour':
                this.input4.nativeElement.focus();
                // this.ref.detectChanges();
                break;
            case 'inputFive':
                this.input5.nativeElement.focus();
                // this.ref.detectChanges();
                break;
            case 'inputSix':
                this.input6.nativeElement.focus();
                // this.ref.detectChanges();
                break;
            default:
                break;
        }
    };
    VerificationNumberPage.prototype.doVerify = function () {
        var _this = this;
        this.loader.presentLoading();
        var code = this.value1 + this.value2 + this.value3 + this.value4 + this.value5 + this.value6;
        var params = {
            verify_code: code
        };
        var url = 'api/users/' + this.navParams.get('id') + '/verify';
        this.api.put(params, url).subscribe(function (data) {
            console.log(data);
            _this.loader.dimissLoading();
            if (data.status === 200) {
                _this.user.user_id = data.data.id;
                _this.user.name = data.data.name;
                _this.user.email = data.data.email;
                _this.user.short_description = data.data.description;
                _this.user.status = data.data.status;
                _this.user.gender = data.data.gender;
                _this.user.occupation = data.data.occupation;
                _this.user.age = data.data.age;
                _this.user.dob = data.data.dob;
                _this.user.profile_image = data.data.profile_image;
                _this.user.email_verified = data.data.email_verified;
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
                _this.navCtrl.setRoot(TabsPage);
            }
            else {
                if (data.message) {
                }
                else {
                    _this.navCtrl.setRoot("LoginPage");
                }
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', err);
            console.log(err);
        });
    };
    // /** get current position */
    VerificationNumberPage.prototype.getCurrentPosition = function () {
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
                    env.user.state = a[3].long_name;
                    env.user.country = a[4].long_name;
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
    /** resend OTP */
    VerificationNumberPage.prototype.resendCode = function () {
        var _this = this;
        this.loader.presentLoading();
        //  var a = parseInt(this.value1.toString()+this.value2.toString()+this.value3.toString()+this.value4.toString()+this.value5.toString()+this.value6.toString())
        //console.log(a);
        var params = {
            user_id: this.navParams.get('id'),
            mobile: this.navParams.get('mobile')
        };
        this.user.callApi(params, 'verifiy_mobile_number').subscribe(function (data) {
            console.log(data);
            _this.loader.dimissLoading();
            if (data.status != 0) {
                _this.alert.showAlert('Message', data.message);
                // this.nativeStorage.setItem('user_data', {data:data.data})
                // .then(
                //   () => console.log('Stored item!'),
                //   error => console.error('Error storing item', error)
                // );
                //   this.user.user_id = data.data.id;
                //   this.user.name = data.data.name;
                //   this.user.short_description = data.data.description;
                //   this.user.status = data.data.status;
                //   this.user.gender = data.data.gender;
                //   this.user.occupation = data.data.occupation;
                //   this.user.age = data.data.age;
                //   this.user.profile_image = data.data.profile_image;
                // this.navCtrl.setRoot(TabsPage);
            }
            else {
                if (data.message) {
                    _this.alert.showAlert('Error', data.message);
                }
                else {
                    _this.alert.showAlert('Error', data.error);
                }
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', err);
            console.log(err);
        });
    };
    __decorate([
        ViewChild('inputFirst'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input1", void 0);
    __decorate([
        ViewChild('inputSecond'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input2", void 0);
    __decorate([
        ViewChild('inputThird'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input3", void 0);
    __decorate([
        ViewChild('inputFour'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input4", void 0);
    __decorate([
        ViewChild('inputFive'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input5", void 0);
    __decorate([
        ViewChild('inputSix'),
        __metadata("design:type", Object)
    ], VerificationNumberPage.prototype, "input6", void 0);
    VerificationNumberPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-verification-number',
            templateUrl: 'verification-number.html',
        }),
        __metadata("design:paramtypes", [ApiProvider, TranslateService, NavController, ChangeDetectorRef, Geolocation, NavParams, NativeStorage, UserProvider, AlertProvider, LoaderProvider])
    ], VerificationNumberPage);
    return VerificationNumberPage;
}());
export { VerificationNumberPage };
//# sourceMappingURL=verification-number.js.map