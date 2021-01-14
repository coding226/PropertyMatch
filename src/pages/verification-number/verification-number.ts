import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {ApiProvider} from './../../providers/api/api';
import {UserProvider} from './../../providers/user/user';
import {AlertProvider} from './../../providers/alert/alert';
import {LoaderProvider} from './../../providers/loader/loader';

import {TabsPage} from '../../pages/tabs/tabs';
import {TranslateService} from '@ngx-translate/core';

declare var google;

/**
 * Generated class for the VerificationNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
    selector: 'page-verification-number',
    templateUrl: 'verification-number.html',
})
export class VerificationNumberPage {
    @ViewChild('inputFirst') input1;
    @ViewChild('inputSecond') input2;
    @ViewChild('inputThird') input3;
    @ViewChild('inputFour') input4;
    @ViewChild('inputFive') input5;
    @ViewChild('inputSix') input6;
    value1: string;
    value2: string;
    value3: string;
    value4: string;
    value5: string;
    value6: string;
    countDown;
    counter = 60;
    tick = 1000;

    constructor(public api: ApiProvider, translate: TranslateService, public navCtrl: NavController, public geolocation: Geolocation, public navParams: NavParams, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider) {
        translate.setDefaultLang(localStorage.language);
    }

    ionViewDidLoad() {
        this.countDown = Observable.timer(0, this.tick)
            .take(this.counter)
            .map(() => --this.counter)
    }

    /** set focus */
    setfocus(value: any) {
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
    }

    doVerify() {
        this.loader.presentLoading();
        const code = this.value1 + this.value2 + this.value3 + this.value4 + this.value5 + this.value6;
        const params = {
            verify_code: code
        }
        const url = 'api/users/' + this.navParams.get('id') + '/verify';
        this.api.put(params, url).subscribe(data => {
            this.loader.dimissLoading();
            if (data.status === 200) {
                this.user.user_id = data.data.id;
                this.user.name = data.data.name;
                this.user.email = data.data.email;
                this.user.short_description = data.data.description;
                this.user.status = data.data.status;
                this.user.gender = data.data.gender;
                this.user.occupation = data.data.occupation;
                this.user.age = data.data.age;
                this.user.dob = data.data.dob;
                this.user.profile_image = data.data.profile_image;
                this.user.email_verified = data.data.email_verified;
                if (data.data.city != null) {
                    this.user.city = data.data.city;
                }
                if (data.data.region != null) {
                    this.user.state = data.data.region;
                }
                if (data.data.country != null) {
                    this.user.country = data.data.country;
                }
                if (data.data.lat != null && data.data.lon != null) {
                    this.user.latitude = data.data.lat;
                    this.user.longitude = data.data.lon;
                } else {
                    this.getCurrentPosition();
                }
                this.navCtrl.setRoot(TabsPage);
            } else {
                if (data.message) {
                    this.alert.showAlert('Error', data.message);
                } else {
                    this.navCtrl.setRoot("LoginPage");
                }
            }
        }, err => {
            this.loader.dimissLoading();
            this.alert.showAlert('Error', err);
        });
    }

    // /** get current position */
    getCurrentPosition() {
        var env = this;
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log("getCurrentPosition", resp);
            this.user.latitude = resp.coords.latitude;
            this.user.longitude = resp.coords.longitude;

            var lat = this.user.latitude;
            var lng = this.user.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    let a = results[1].address_components;
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
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    /** resend OTP */
    resendCode() {
        this.loader.presentLoading();
        //  var a = parseInt(this.value1.toString()+this.value2.toString()+this.value3.toString()+this.value4.toString()+this.value5.toString()+this.value6.toString())
        //console.log(a);
        let params = {
            user_id: this.navParams.get('id'),
            mobile: this.navParams.get('mobile')
        }
        this.user.callApi(params, 'verifiy_mobile_number').subscribe(data => {
            console.log(data);
            this.loader.dimissLoading();
            if (data.status != 0) {
                this.alert.showAlert('Message', data.message);

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
            } else {
                if (data.message) {
                    this.alert.showAlert('Error', data.message);
                } else {
                    this.alert.showAlert('Error', data.error);
                }
            }
        }, err => {
            this.loader.dimissLoading();
            this.alert.showAlert('Error', err);
            console.log(err);
        })
    }
}
