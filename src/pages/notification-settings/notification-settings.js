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
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';
var NotificationSettingsPage = /** @class */ (function () {
    function NotificationSettingsPage(navCtrl, navParams, user, api, nativeStorage, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.api = api;
        this.nativeStorage = nativeStorage;
        translate.setDefaultLang(localStorage.language);
    }
    NotificationSettingsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad NotificationSettingsPage');
        // debugger;
        if (this.user.setting_newmatches && (this.user.setting_newmatches == '1' || this.user.setting_newmatches == true)) {
            this.newMatches = true;
        }
        else {
            this.newMatches = false;
        }
        if (this.user.setting_messages && (this.user.setting_messages == '1' || this.user.setting_messages == true)) {
            this.messages = true;
        }
        else {
            this.messages = false;
        }
        if (this.user.setiing_inappvibrations && (this.user.setiing_inappvibrations == '1' || this.user.setiing_inappvibrations == true)) {
            this.inappVibrations = true;
        }
        else {
            this.inappVibrations = false;
        }
        if (this.user.setinng_inappsound && (this.user.setinng_inappsound == '1' || this.user.setinng_inappsound == true)) {
            this.inAppSound = true;
        }
        else {
            this.inAppSound = false;
        }
    };
    NotificationSettingsPage.prototype.ionViewWillEnter = function () {
        this.user.hideTabs = true;
        this.api.get({}, 'api/users/' + localStorage.user_id).subscribe(function (res) {
            if (res.status === 200) {
            }
        });
    };
    NotificationSettingsPage.prototype.ionViewWillLeave = function () {
        this.user.hideTabs = false;
    };
    NotificationSettingsPage.prototype.changePreferances = function () {
        var params = {
            // user_id: this.user.user_id,
            setting_newmatches: (this.newMatches) ? 1 : 0,
            setting_messages: (this.messages) ? 1 : 0,
            setting_inappvibrations: (this.inappVibrations) ? 1 : 0,
            setting_inappsound: (this.inAppSound) ? 1 : 0
        };
        this.commonUpdateAPI(params);
    };
    NotificationSettingsPage.prototype.commonUpdateAPI = function (params) {
        var _this = this;
        this.api.put(params, 'api/users/' + this.user.user_id).subscribe(function (data) {
            if (data.status === 200) {
                _this.user.setting_newmatches = data.data.setting_newmatches;
                _this.user.setting_messages = data.data.setting_messages;
                _this.user.setting_inappvibrations = data.data.setting_inappvibrations;
                _this.user.setting_inappsound = data.data.setting_inappsound;
            }
            // this.nativeStorage.clear();
            // this.nativeStorage.setItem('user_data', { data: data.data })
            // .then(
            //   () => console.log('Stored item!'),
            //   error => console.error('Error storing item', error)
            //   );
        }, function (err) {
            console.log(err);
        });
    };
    NotificationSettingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-notification-settings',
            templateUrl: 'notification-settings.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            UserProvider,
            ApiProvider,
            NativeStorage,
            TranslateService])
    ], NotificationSettingsPage);
    return NotificationSettingsPage;
}());
export { NotificationSettingsPage };
//# sourceMappingURL=notification-settings.js.map