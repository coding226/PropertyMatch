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
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
var SignupPage = /** @class */ (function () {
    function SignupPage(translate, navCtrl, navParams, user, api, alert, loader) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.callingcodes = [];
        translate.setDefaultLang(localStorage.language);
        this.signupForm = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
            ])),
            password: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
            mobile_no: new FormControl('', Validators.required),
            code: new FormControl('', Validators.required),
        });
    }
    SignupPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.user.getCallingCodes().subscribe(function (r) {
            var sorted = _.sortBy(r, 'name');
            _this.callingcodes = sorted;
        });
    };
    SignupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SignupPage');
    };
    /** go to login page */
    SignupPage.prototype.login = function () {
        this.navCtrl.setRoot('LoginPage');
    };
    /** go to verify number */
    SignupPage.prototype.verify = function () {
        this.navCtrl.setRoot('VerificationNumberPage');
    };
    /** do signup */
    SignupPage.prototype.doSignUp = function () {
        var _this = this;
        var codedata = this.signupForm.value.code.split(',');
        this.loader.presentLoading();
        var params = {
            name: this.signupForm.value.username,
            password: this.signupForm.value.password,
            email: this.signupForm.value.email.toLowerCase(),
            mobile: codedata[0].replace('+', '') + this.signupForm.value.mobile_no,
            gender: this.signupForm.value.gender,
        };
        this.api.post(params, 'api/auth/register').subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status === 200) {
                _this.alert.showAlert('Message', data.message);
                _this.navCtrl.setRoot('VerificationNumberPage', {
                    id: data.data.id,
                    mobile: data.data.mobile,
                    userdata: data.data,
                });
            }
            else {
                _this.alert.showAlert('Error', data.message);
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', 'Server not responding');
        });
        // this.user.callApi(params, 'signup').subscribe(
        // 	data => {
        // 		this.loader.dimissLoading();
        // 		if (data.status != 0) {
        // 			this.alert.showAlert('Message', data.message);
        // 			this.navCtrl.setRoot('VerificationNumberPage', {
        // 				id: data.data.id,
        // 				mobile: data.data.mobile,
        // 				userdata: data.data,
        // 			});
        // 		} else {
        // 			this.alert.showAlert('Error', data.message);
        // 		}
        // 	},
        // 	err => {
        // 		this.loader.dimissLoading();
        // 		this.alert.showAlert('Error', 'Server not responding');
        // 	}
        // 	);
    };
    SignupPage.prototype.checkMobileNumber = function () {
        var mobileNumber = this.signupForm.value.mobile_no;
        while (mobileNumber.charAt(0) === '0') {
            mobileNumber = mobileNumber.substr(1);
            this.signupForm.patchValue({
                mobile_no: mobileNumber
            });
        }
    };
    SignupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-signup',
            templateUrl: 'signup.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavController,
            NavParams,
            UserProvider,
            ApiProvider,
            AlertProvider,
            LoaderProvider])
    ], SignupPage);
    return SignupPage;
}());
export { SignupPage };
//# sourceMappingURL=signup.js.map
