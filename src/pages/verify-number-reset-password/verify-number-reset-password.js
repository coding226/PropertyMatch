var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the VerifyNumberResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VerifyNumberResetPasswordPage = /** @class */ (function () {
    function VerifyNumberResetPasswordPage(translate, navCtrl, ref, geolocation, navParams, nativeStorage, user, alert, loader) {
        this.navCtrl = navCtrl;
        this.ref = ref;
        this.geolocation = geolocation;
        this.navParams = navParams;
        this.nativeStorage = nativeStorage;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.showVerify = true;
        this.counter = 60;
        this.tick = 1000;
        translate.setDefaultLang(localStorage.language);
        this.passwordForm = new FormGroup({
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required),
        });
    }
    VerifyNumberResetPasswordPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad VerificationNumberPage');
        this.countDown = Observable.timer(0, this.tick)
            .take(this.counter)
            .map(function () { return --_this.counter; });
    };
    /** set focus */
    VerifyNumberResetPasswordPage.prototype.setfocus = function (value) {
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
    VerifyNumberResetPasswordPage.prototype.doVerify = function () {
        var _this = this;
        this.loader.presentLoading();
        var a = this.value1 + this.value2 + this.value3 + this.value4 + this.value5 + this.value6;
        var params = {
            number: a
        };
        this.user.callApi(params, 'verify_mobile_number_reset_password').subscribe(function (data) {
            console.log(data);
            if (data.status) {
                _this.userId = data.data.user_id;
                _this.showVerify = false;
            }
            _this.loader.dimissLoading();
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', err);
        });
    };
    VerifyNumberResetPasswordPage.prototype.doSignUp = function () {
        var _this = this;
        var param = __assign({}, this.passwordForm.getRawValue());
        if (param.password !== param.confirmPassword) {
            this.alert.showAlert('Error', 'Password not match');
            return;
        }
        this.user.callApi({
            password: param.password,
            user_id: this.userId
        }, 'change_password').subscribe(function (data) {
            console.log(data);
            if (data.status) {
                _this.alert.showAlert("Message", "Change password successfully.");
                _this.navCtrl.setRoot("GetstartedPage");
            }
            _this.loader.dimissLoading();
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', err);
        });
    };
    __decorate([
        ViewChild('inputFirst'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input1", void 0);
    __decorate([
        ViewChild('inputSecond'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input2", void 0);
    __decorate([
        ViewChild('inputThird'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input3", void 0);
    __decorate([
        ViewChild('inputFour'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input4", void 0);
    __decorate([
        ViewChild('inputFive'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input5", void 0);
    __decorate([
        ViewChild('inputSix'),
        __metadata("design:type", Object)
    ], VerifyNumberResetPasswordPage.prototype, "input6", void 0);
    VerifyNumberResetPasswordPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-verify-number-reset-password',
            templateUrl: 'verify-number-reset-password.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, ChangeDetectorRef, Geolocation, NavParams, NativeStorage, UserProvider, AlertProvider, LoaderProvider])
    ], VerifyNumberResetPasswordPage);
    return VerifyNumberResetPasswordPage;
}());
export { VerifyNumberResetPasswordPage };
//# sourceMappingURL=verify-number-reset-password.js.map