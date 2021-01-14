var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events, Content, ModalController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
var ChatViewPage = /** @class */ (function () {
    function ChatViewPage(translate, navCtrl, platform, _ngZone, navParams, events, user, api, alert, loader, modalCtrl) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this._ngZone = _ngZone;
        this.navParams = navParams;
        this.events = events;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.modalCtrl = modalCtrl;
        this.chat = [];
        translate.setDefaultLang(localStorage.language);
    }
    ChatViewPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.platform.resume.subscribe(function () {
            _this.readMessages();
            _this.getChatMessages();
        });
    };
    ChatViewPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.chat_title = this.navParams.get('title');
        this.id = this.navParams.get('id');
        this.property_id = this.navParams.get('property_id');
        this.events.subscribe('MESSAGE:RECIEVED', function (notificationData) {
            var data = JSON.parse(notificationData.data);
            if (_this.property_id == data.property_id) {
                _this._ngZone.run(function () {
                    _this.chat.push(data);
                });
            }
        });
        this.user.hideTabs = true;
        this.readMessages();
        this.getChatMessages();
    };
    ChatViewPage.prototype.ionViewWillLeave = function () {
        this.user.hideTabs = false;
        this.events.unsubscribe('MESSAGE:RECIEVED');
    };
    /** add appointment */
    ChatViewPage.prototype.addAppointment = function () {
        this.navCtrl.push("AddAppointmentPage", { reciever_id: this.reciever_id, property_id: this.property_id, chat_title: this.chat_title });
    };
    ChatViewPage.prototype.readMessages = function () {
        var params = {
            thread_id: this.id,
            user_id: this.user.user_id,
        };
        this.api.put(params, 'api/chats/read').subscribe(function (data) {
            if (data.status === 200) {
            }
        }, function (err) {
        });
    };
    /** get chat messages */
    ChatViewPage.prototype.getChatMessages = function () {
        var _this = this;
        var params = {
            sender_id: this.user.user_id,
            receiver_id: this.reciever_id,
            property_id: this.property_id
        };
        this.api.get({}, 'api/chats/' + this.id).subscribe(function (data) {
            if (data.status === 200) {
                _this.getNewMessage();
                _this.chat = data.data;
                setTimeout(function () {
                    _this.scroll();
                }, 200);
            }
        }, function (err) {
            console.log(err);
        });
    };
    ChatViewPage.prototype.getNewMessage = function () {
        this.events.publish('NEWMESSAGE');
    };
    /** send message */
    ChatViewPage.prototype.sendMessage = function () {
        var _this = this;
        if (this.message != undefined && this.message != '') {
            var params = {
                user_id: Number(this.user.user_id),
                thread_id: this.id,
                message: this.message,
                property_id: this.property_id
            };
            this.message = '';
            this.api.post(params, 'api/chats').subscribe(function (data) {
                if (data.status === 200) {
                    _this.chat.push(data.data);
                    setTimeout(function () {
                        _this.scroll();
                    }, 200);
                }
            }, function (err) {
                console.log(err);
            });
        }
    };
    ChatViewPage.prototype.ScrollToBottom = function () {
        var element = document.getElementById('myLabel');
        setTimeout(function () {
            element.scrollIntoView(true);
        }, 200);
    };
    ChatViewPage.prototype.autoScroll = function () {
        setTimeout(function () {
            var itemList = document.getElementById('chat-autoscroll');
            itemList.scrollTop = itemList.scrollHeight;
        });
    };
    ChatViewPage.prototype.scroll = function () {
        if (this.content) {
            this.content.scrollToBottom();
        }
    };
    ChatViewPage.prototype.acceptOrRejectAppoitment = function (messageId, appointmentId, type, index) {
        var _this = this;
        var params = {
            appointment_id: appointmentId,
            message_id: messageId,
            request: type
        };
        this.user.callApi(params, 'appointment_accept_reject').subscribe(function (data) {
            if (data.status != 0) {
                _this.chat.splice(index, 1);
                _this.message = (type == 1) ? "Your appointment has been accepted" : "Your appointment has been declined";
                _this.sendMessage();
            }
        }, function (err) {
            console.log(err);
        });
    };
    ChatViewPage.prototype.openDetail = function () {
        var _this = this;
        var params = {
            user_id: this.user.user_id,
            property_id: this.property_id
        };
        this.user.callApi(params, 'get_property').subscribe(function (data) {
            console.log(data);
            if (data.status != 0) {
                var modal = _this.modalCtrl.create("PropertyDetailPage", {
                    detail: data.data,
                    from: "CHAT_PAGE"
                });
                // modal.onDidDismiss((data) => {
                // 	if(data.option == 'cancel'){
                // 		this.voteUp(false, data.data.id)
                // 	}
                // });
                modal.present();
            }
        }, function (err) {
            // console.log(err);
        });
    };
    ChatViewPage.prototype.voteUp = function (like, propertyId) {
        this.acceptRejectProperty(this.user.user_id, propertyId, 0);
    };
    ChatViewPage.prototype.acceptRejectProperty = function (userId, propertyId, type) {
        var _this = this;
        var params = {
            user_id: userId,
            property_id: propertyId,
            request: type
        };
        this.user.callApi(params, 'property_accept_reject').subscribe(function (data) {
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    ChatViewPage.prototype.getChatDate = function (date) {
        return new Date(date);
    };
    ChatViewPage.prototype.isMe = function (msg) {
        return (msg.user_id === Number(this.user.user_id));
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ChatViewPage.prototype, "content", void 0);
    ChatViewPage = __decorate([
        IonicPage({
            name: 'chat-view'
        }),
        Component({
            selector: 'page-chat-view',
            templateUrl: 'chat-view.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavController,
            Platform,
            NgZone,
            NavParams, Events, UserProvider,
            ApiProvider, AlertProvider, LoaderProvider,
            ModalController])
    ], ChatViewPage);
    return ChatViewPage;
}());
export { ChatViewPage };
//# sourceMappingURL=chat-view.js.map