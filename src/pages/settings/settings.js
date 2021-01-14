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
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
var SettingsPage = /** @class */ (function () {
    function SettingsPage(translate, navCtrl, iap, navParams, user, nativeStorage, alert, app) {
        this.navCtrl = navCtrl;
        this.iap = iap;
        this.navParams = navParams;
        this.user = user;
        this.nativeStorage = nativeStorage;
        this.alert = alert;
        this.app = app;
        translate.setDefaultLang(localStorage.language);
    }
    SettingsPage.prototype.ionViewWillEnter = function () {
        this.user.hideTabs = true;
        this.currentLang = localStorage.language;
    };
    SettingsPage.prototype.ionViewWillLeave = function () {
        this.user.hideTabs = false;
    };
    /** sign out */
    SettingsPage.prototype.signOut = function () {
        localStorage.clear();
        this.nativeStorage.clear();
        this.alert.showAlert("Message", "Sign out successfully.");
        // this.navCtrl.setRoot("GetstartedPage");
        this.app.getRootNav().setRoot("GetstartedPage");
        this.updateDevicetoken();
    };
    SettingsPage.prototype.updateDevicetoken = function () {
        this.user.callApi({ user_id: this.user.user_id }, 'remove_device_token').subscribe(function (data) {
        }, function (err) {
            console.log(err);
        });
    };
    /** in app purchase of boost likes */
    SettingsPage.prototype.purchaseBoostLikes = function () {
        // this.iap
        //   .getProducts(['com.ameba.propertymatch'])
        //   .then((products) => {
        //     console.log(products);
        //       //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
        // this.iap
        // 	.buy('com.ameba.propertymatch')
        // 	.then((data) => {
        // 	})
        // 	.catch((err) => {
        // 		console.log(err);
        // 		this.alert.showAlert("Error", err.message);
        // 	});
    };
    SettingsPage.prototype.notificationSetting = function () {
        this.navCtrl.push("NotificationSettingsPage");
    };
    SettingsPage.prototype.personalSetting = function () {
        this.navCtrl.push("EditProfilePage");
    };
    SettingsPage.prototype.phoneNumberSetting = function () {
        this.navCtrl.push("PhonenumberPage", { path: 'setting' });
    };
    SettingsPage.prototype.LanguageSetting = function () {
        this.navCtrl.push("ChooseLanguagePage", { path: 'setting' });
    };
    SettingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-settings',
            templateUrl: 'settings.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavController,
            InAppPurchase,
            NavParams,
            UserProvider,
            NativeStorage,
            AlertProvider,
            App])
    ], SettingsPage);
    return SettingsPage;
}());
export { SettingsPage };
//# sourceMappingURL=settings.js.map