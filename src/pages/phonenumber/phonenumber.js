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
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the PhonenumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PhonenumberPage = /** @class */ (function () {
    function PhonenumberPage(translate, navCtrl, navParams, user, alert, loader) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.settings = false;
        this.callingcodes = [];
        translate.setDefaultLang(localStorage.language);
        if (this.navParams.get('path') == 'setting') {
            this.settings = true;
        }
    }
    PhonenumberPage.prototype.ionViewDidLoad = function () { };
    PhonenumberPage.prototype.ionViewWillEnter = function () {
        this.user.hideTabs = true;
    };
    PhonenumberPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.user.getCallingCodes().subscribe(function (r) {
            var sorted = _.sortBy(r, 'name');
            _this.callingcodes = sorted;
        });
    };
    PhonenumberPage.prototype.ionViewWillLeave = function () {
        // this.user.hideTabs = false;
    };
    /**  add mobile number*/
    PhonenumberPage.prototype.continue = function () {
        var _this = this;
        var codedata = this.code.split(',');
        this.loader.presentLoading();
        var params = {};
        if (this.navParams.get('path') == 'setting') {
            params = {
                user_id: this.user.user_id,
                mobile: codedata[0].replace('+', '') + this.mobile_number,
            };
        }
        else {
            params = {
                user_id: this.navParams.get('id'),
                mobile: codedata[0].replace('+', '') + this.mobile_number,
            };
        }
        this.user.callApi(params, 'verifiy_mobile_number').subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status != 0) {
                _this.alert.showAlert('Message', data.message);
                if (data.data.is_verified == 0) {
                    _this.navCtrl.setRoot('VerificationNumberPage', { id: data.data.id });
                }
                else {
                    _this.navCtrl.setRoot('VerificationNumberPage', { id: _this.user.user_id });
                }
            }
            else {
                _this.alert.showAlert('Error', data.message);
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', err);
            console.log(err);
        });
    };
    PhonenumberPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-phonenumber',
            templateUrl: 'phonenumber.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavController,
            NavParams,
            UserProvider,
            AlertProvider,
            LoaderProvider])
    ], PhonenumberPage);
    return PhonenumberPage;
}());
export { PhonenumberPage };
//# sourceMappingURL=phonenumber.js.map