var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Component, NgZone } from '@angular/core';
import { IonicPage, Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
var MessagesPage = /** @class */ (function () {
    function MessagesPage(events, alertCtrl, navCtrl, _ngZone, navParams, api, user, alert, translate, loader) {
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this._ngZone = _ngZone;
        this.navParams = navParams;
        this.api = api;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.user_mode = 'seeker';
        this.seeker_matches = 'new';
        this.landlord_matches = 'new';
        this.new_matches_seeker = [];
        this.matched_requests_landlord = [];
        this.seeker_message_list = [];
        this.landlord_message_list = [];
        this.newMessageLandlord = 0;
        this.newMessageSeeker = 0;
        translate.setDefaultLang(localStorage.language);
    }
    MessagesPage.prototype.ionViewDidLoad = function () {
    };
    MessagesPage.prototype.ionViewWillEnter = function () {
        this._loadingData();
    };
    MessagesPage.prototype._loadingData = function () {
        this.newMessageLandlord = 0;
        this.newMessageSeeker = 0;
        this.getNewMatchesForSeeker();
        this.getSeekerMessageList();
        this.getLandlordMessageList();
        this.getMatchedRequestsForLandlord();
        this.getNewMessage();
        this.events.publish('NEWMESSAGE');
    };
    MessagesPage.prototype._apiDeleteMessage = function (id) {
        var _this = this;
        this.api.delete('api/chatthreads/' + id).subscribe(function (data) {
            if (data.status) {
                _this._loadingData();
            }
        }, function (err) {
            _this.alert.showAlert("Error", "Server is not responding");
        });
    };
    MessagesPage.prototype.deleteMessage = function (list) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Confirm to delete ?',
            message: 'Confirm to delete this message.',
            buttons: [
                {
                    text: 'Disagree',
                    handler: function () {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Agree',
                    handler: function () {
                        _this._apiDeleteMessage(list.thread_id);
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    MessagesPage.prototype.getNewMessage = function () {
        var _this = this;
        var params = {
            user_id: this.user.user_id,
        };
        this.api.get(params, 'api/chats/unread').subscribe(function (data) {
            if (data.status === 200) {
                data.data.forEach(function (message) {
                    console.log(message);
                    if (message.chat_thread.sender_id === Number(_this.user.user_id)) {
                        _this.newMessageSeeker++;
                    }
                    else {
                        _this.newMessageLandlord++;
                    }
                });
                console.log(_this.newMessageLandlord, _this.newMessageSeeker);
            }
            else {
            }
        });
    };
    MessagesPage.prototype.getNewMatchesForSeeker = function () {
        var _this = this;
        this.api.get({}, 'api/requests/landlord-matched/' + this.user.user_id).subscribe(function (data) {
            if (data.status === 200) {
                if (data.data) {
                    _this._ngZone.run(function () {
                        _this.new_matches_seeker = data.data;
                    });
                }
            }
            else {
            }
        }, function (err) {
            _this.alert.showAlert("Error", "Server is not responding");
        });
    };
    /** landlord requests from seeker */
    MessagesPage.prototype.getMatchedRequestsForLandlord = function () {
        var _this = this;
        this.api.get({}, 'api/requests/seeker-matched/' + this.user.user_id).subscribe(function (data) {
            if (data.status === 200) {
                if (data.data) {
                    _this.matched_requests_landlord = data.data;
                }
                else {
                    _this.matched_requests_landlord = [];
                }
            }
            else {
                // this.alert.showAlert("Message", "No requests for landlord");
            }
        }, function (err) {
            // console.log(err);
        });
    };
    /** go first tab */
    MessagesPage.prototype.goFirstTab = function (data) {
        this.navCtrl.push("ProfilePage", { rootFrom: 'message', data: data });
    };
    MessagesPage.prototype.openChat = function (request) {
        var _this = this;
        var params = {
            request_id: request.id,
            property_id: request.property_id,
            sender_id: request.property.user_id,
            receiver_id: request.user_id,
        };
        this.api.post(params, 'api/chatthreads').subscribe(function (data) {
            if (data.status === 200) {
                _this.navCtrl.push("chat-view", {
                    property_id: request.property_id,
                    id: data.data.thread_id,
                    title: request.property.title
                });
            }
        });
    };
    /** chats */
    MessagesPage.prototype.chat = function (property_id, id, title) {
        this.navCtrl.push("chat-view", { property_id: property_id, id: id, title: title });
    };
    /** send message */
    MessagesPage.prototype.getSeekerMessageList = function () {
        var _this = this;
        this.api.get({}, 'api/chatthreads/sender/' + this.user.user_id).subscribe(function (data) {
            // console.log(data);
            if (data.status === 200) {
                _this.seeker_message_list = __spreadArrays(data.data);
            }
            else {
                _this.seeker_message_list = [];
            }
        }, function (err) {
            // console.log(err);
        });
    };
    /** send message */
    MessagesPage.prototype.getLandlordMessageList = function () {
        var _this = this;
        this.api.get({}, 'api/chatthreads/receiver/' + this.user.user_id).subscribe(function (data) {
            // console.log(data);
            if (data.status === 200) {
                var a = data.data;
                _this.landlord_message_list = __spreadArrays(data.data);
                // console.log(this.landlord_message_list);
            }
            else {
                _this.landlord_message_list = [];
            }
        }, function (err) {
            // console.log(err);
        });
    };
    /** go to settings */
    MessagesPage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    MessagesPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-messages',
            templateUrl: 'messages.html',
        }),
        __metadata("design:paramtypes", [Events,
            AlertController,
            NavController,
            NgZone,
            NavParams,
            ApiProvider,
            UserProvider,
            AlertProvider,
            TranslateService,
            LoaderProvider])
    ], MessagesPage);
    return MessagesPage;
}());
export { MessagesPage };
//# sourceMappingURL=messages.js.map