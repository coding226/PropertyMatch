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
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { UserProvider } from "./../../providers/user/user";
import { AlertProvider } from "./../../providers/alert/alert";
import { LoaderProvider } from "./../../providers/loader/loader";
import { TranslateService } from '@ngx-translate/core';
var ForgetPasswordPage = /** @class */ (function () {
    function ForgetPasswordPage(navCtrl, navParams, user, alert, loader, translate) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        translate.setDefaultLang(localStorage.language);
        this.forgetPasswordForm = new FormGroup({
            email: new FormControl("", Validators.required),
        });
    }
    ForgetPasswordPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ForgetPasswordPage');
    };
    ForgetPasswordPage.prototype.submitPasswordReques = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = { email: this.forgetPasswordForm.value.email };
        this.user.callApi(params, "forget_password").subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status == 0) {
                _this.alert.showAlert("Error", data.message);
            }
            else {
                _this.navCtrl.setRoot("VerifyNumberResetPasswordPage");
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", "Server not responding");
        });
    };
    ForgetPasswordPage = __decorate([
        IonicPage({
            name: "forget-password"
        }),
        Component({
            selector: 'page-forget-password',
            templateUrl: 'forget-password.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            UserProvider,
            AlertProvider,
            LoaderProvider,
            TranslateService])
    ], ForgetPasswordPage);
    return ForgetPasswordPage;
}());
export { ForgetPasswordPage };
//# sourceMappingURL=forget-password.js.map