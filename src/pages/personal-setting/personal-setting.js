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
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
var PersonalSettingPage = /** @class */ (function () {
    function PersonalSettingPage(translate, navCtrl, api, nativeStorage, navParams, user, alert, loader) {
        this.navCtrl = navCtrl;
        this.api = api;
        this.nativeStorage = nativeStorage;
        this.navParams = navParams;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.date_of_birth = '';
        console.log("this.user....", this.user);
        translate.setDefaultLang(localStorage.language);
        this.name = this.user.name;
        this.email = this.user.email;
    }
    PersonalSettingPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PersonalSettingPage');
    };
    PersonalSettingPage.prototype.ionViewWillEnter = function () {
        this.user.hideTabs = true;
        this.getStatus();
    };
    PersonalSettingPage.prototype.ionViewWillLeave = function () {
        this.user.hideTabs = false;
    };
    /** edit personal information */
    PersonalSettingPage.prototype.editInfo = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
            name: this.name,
            dob: this.date_of_birth || '',
            email: this.email,
            description: this.user.short_description,
        };
        this.user.callApi(params, 'edit_seeker_profile').subscribe(function (data) {
            console.log(data);
            _this.loader.dimissLoading();
            if (data.status != 0) {
                _this.nativeStorage.clear();
                _this.nativeStorage.setItem('user_data', { data: data.data })
                    .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
                _this.user.user_id = data.data.id;
                _this.user.name = data.data.name;
                _this.user.short_description = data.data.description;
                _this.user.status = data.data.status;
                _this.user.gender = data.data.gender;
                _this.user.occupation = data.data.occupation;
                _this.user.age = data.data.age;
                _this.user.profile_image = data.data.profile_image;
                // this.alert.showAlert('Message', "Updated successfully");
                _this.navCtrl.push("SettingsPage", { id: _this.user.user_id }).then(function () {
                    var index = _this.navCtrl.getActive().index;
                    _this.navCtrl.remove(index - 1);
                    //this.navCtrl.remove(index - 2);
                });
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
    /** get attribute */
    PersonalSettingPage.prototype.getStatus = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
        };
        this.user.callApi(params, 'get_user_data').subscribe(function (data) {
            console.log("getStatus..", data);
            _this.loader.dimissLoading();
            if (data.status != 0) {
                _this.nativeStorage.clear();
                _this.nativeStorage.setItem('user_data', { data: data.data })
                    .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
                _this.user.user_id = data.data.id;
                _this.user.email = data.data.email;
                _this.user.email_verified = data.data.email_verified;
                _this.user.name = data.data.name;
                // this.user.short_description = data.data.description;
                _this.user.short_description = "";
                _this.user.status = data.data.status;
                _this.user.gender = data.data.gender;
                _this.user.occupation = data.data.occupation;
                _this.user.age = data.data.age;
                _this.user.profile_image = data.data.profile_image;
                _this.date_of_birth = data.data.dob;
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
    /** resend email */
    PersonalSettingPage.prototype.resendVerification = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
            email: this.email
        };
        this.user.callApi(params, 'resend_email_verification').subscribe(function (data) {
            console.log(data);
            _this.loader.dimissLoading();
            if (data.status != 0) {
                _this.nativeStorage.clear();
                _this.nativeStorage.setItem('user_data', { data: data.data })
                    .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
                _this.user.user_id = data.data.id;
                _this.user.email = data.data.email;
                _this.user.email_verified = data.data.email_verified;
                _this.user.name = data.data.name;
                _this.user.short_description = data.data.description;
                _this.user.status = data.data.status;
                _this.user.gender = data.data.gender;
                _this.user.occupation = data.data.occupation;
                _this.user.age = data.data.age;
                _this.user.profile_image = data.data.profile_image;
                // this.alert.showAlert('Message', data.message);
                _this.navCtrl.push("SettingsPage", { id: _this.user.user_id }).then(function () {
                    var index = _this.navCtrl.getActive().index;
                    _this.navCtrl.remove(index - 1);
                    //this.navCtrl.remove(index - 2);
                });
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
    PersonalSettingPage.prototype.getProfile = function () {
        if (this.user.profile_image != null) {
            if (this.user.profile_image.startsWith('file')) {
                return this.user.profile_image;
            }
            return this.api.IMAGE_URL + this.user.profile_image;
        }
        else {
            return 'assets/imgs/profile.jpg';
        }
    };
    PersonalSettingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-personal-setting',
            templateUrl: 'personal-setting.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, ApiProvider, NativeStorage, NavParams, UserProvider, AlertProvider, LoaderProvider])
    ], PersonalSettingPage);
    return PersonalSettingPage;
}());
export { PersonalSettingPage };
//# sourceMappingURL=personal-setting.js.map