var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { NavParams, Platform, Tabs, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
var TabsPage = /** @class */ (function () {
    function TabsPage(translate, events, api, user, navParams, platform) {
        var _this = this;
        this.events = events;
        this.api = api;
        this.user = user;
        this.navParams = navParams;
        this.platform = platform;
        this.showTab = true;
        this.tab1Root = "SeekerHomePage";
        this.tab2Root = "ProfilePage";
        this.tab3Root = "MessagesPage";
        this.tabs = [
            {
                root: 'ProfilePage',
                tabTitle: 'Profile',
                tabIcon: 'md-person',
                tabBadge: null,
                tabBadgeStyle: null,
            },
            {
                root: 'SeekerHomePage',
                tabTitle: 'Home',
                tabIcon: 'ios-home',
                tabBadge: null,
                tabBadgeStyle: null,
            },
            {
                root: 'MessagesPage',
                tabTitle: 'Messages',
                tabIcon: 'md-chatboxes',
                tabBadge: 0,
                tabBadgeStyle: 'danger'
            },
        ];
        this.showBadge = true;
        translate.setDefaultLang(localStorage.language);
        events.subscribe('CHANGE_LANGUAGE', function (res) {
            // this.showTab = false;
            setTimeout(function () {
                // this.showTab = true;
            }, 10);
        });
        events.subscribe('notification clicked', function (res) {
            _this.tabRef.select(2);
        });
        events.subscribe('MESSAGE:RECIEVED', function (res) {
            _this.getNewMessage();
        });
        events.subscribe('NEWMESSAGE', function (res) {
            _this.getNewMessage();
        });
    }
    TabsPage.prototype.getNewMessage = function () {
        var _this = this;
        var params = {
            user_id: this.user.user_id,
        };
        this.api.get(params, 'api/chats/unread').subscribe(function (data) {
            if (data.status === 200) {
                _this.user.message_badge = data.data.length;
                _this.tabs[2].tabBadge = data.data.length;
                _this.tabs[2].tabBadgeStyle = 'danger';
            }
            else {
                _this.tabs[2].tabBadge = null;
                _this.tabs[2].tabBadgeStyle = '';
            }
        });
    };
    TabsPage.prototype.ionViewWillEnter = function () {
        this.tabs[2].tabBadge = null;
        this.getNewMessage();
        if (this.navParams.get('index')) {
            this.index = 1;
        }
        else {
            this.index = 0;
        }
    };
    __decorate([
        ViewChild('myTabs'),
        __metadata("design:type", Tabs)
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Component({
            templateUrl: 'tabs.html',
        }),
        __metadata("design:paramtypes", [TranslateService, Events, ApiProvider, UserProvider, NavParams, Platform])
    ], TabsPage);
    return TabsPage;
}());
export { TabsPage };
//# sourceMappingURL=tabs.js.map