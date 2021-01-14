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
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
var ChooseLanguagePage = /** @class */ (function () {
    function ChooseLanguagePage(translate, navParams, navCtrl, events) {
        this.translate = translate;
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.events = events;
        translate.setDefaultLang(localStorage.language);
    }
    ChooseLanguagePage.prototype.ionViewWillEnter = function () {
        this.current = localStorage.language;
        this.translate.setDefaultLang(localStorage.language);
        if (this.navParams.get('path') === 'setting' && this.navCtrl.canGoBack()) {
            this.formSettingPage = true;
        }
    };
    ChooseLanguagePage.prototype.chooseLanguage = function (lang) {
        var _this = this;
        this.current = lang;
        localStorage.setItem("language", this.current);
        this.translate.setDefaultLang(this.current);
        if (this.formSettingPage) {
            this.events.publish('CHANGE_LANGUAGE');
            setTimeout(function () {
                _this.navCtrl.setRoot(TabsPage);
            });
            // location.assign('/');
        }
        else {
            this.navCtrl.setRoot("demo");
        }
    };
    ChooseLanguagePage.prototype.enter = function () {
        this.navCtrl.setRoot("demo");
    };
    ChooseLanguagePage = __decorate([
        IonicPage({
            name: 'ChooseLanguagePage'
        }),
        Component({
            selector: 'page-choose-language',
            templateUrl: 'choose-language.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavParams,
            NavController,
            Events])
    ], ChooseLanguagePage);
    return ChooseLanguagePage;
}());
export { ChooseLanguagePage };
//# sourceMappingURL=choose-language.js.map