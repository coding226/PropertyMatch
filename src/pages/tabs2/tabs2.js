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
import { TranslateService } from '@ngx-translate/core';
var Tabs2Page = /** @class */ (function () {
    function Tabs2Page(translate, navCtrl, navParams, user) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.tab1Root = "SeekerHomePage";
        this.tab2Root = "ProfilePage";
        this.tab3Root = "MessagesPage";
        translate.setDefaultLang(localStorage.language);
    }
    Tabs2Page = __decorate([
        IonicPage(),
        Component({
            selector: 'page-tabs2',
            templateUrl: 'tabs2.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, NavParams, UserProvider])
    ], Tabs2Page);
    return Tabs2Page;
}());
export { Tabs2Page };
//# sourceMappingURL=tabs2.js.map