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
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
var AddAppointmentPage = /** @class */ (function () {
    function AddAppointmentPage(translate, navCtrl, navParams, user, api, alert, loader) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.start_time = new Date().toISOString();
        this.viewTitle = new Date().getMonth();
        this.calendar = {
            mode: 'month',
            currentDate: new Date()
        }; // these are the variable used by the calendar.
        this.selected_date = new Date().toISOString().slice(0, 10);
        console.log("start_time", this.start_time);
        translate.setDefaultLang(localStorage.language);
    }
    AddAppointmentPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AddAppointmentPage');
    };
    AddAppointmentPage.prototype.onViewTitleChanged = function (title) {
        this.viewTitle = title;
        console.log("onViewTitleChanged", title);
    };
    AddAppointmentPage.prototype.onEventSelected = function (event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    };
    AddAppointmentPage.prototype.changeMode = function (mode) {
        this.calendar.mode = mode;
    };
    AddAppointmentPage.prototype.today = function () {
        this.calendar.currentDate = new Date();
    };
    AddAppointmentPage.prototype.onTimeSelected = function (ev) {
        this.selected_date = new Date(ev.selectedTime).toISOString().slice(0, 10);
    };
    AddAppointmentPage.prototype.onCurrentDateChanged = function (event) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    };
    /** get start time */
    AddAppointmentPage.prototype.getStartTime = function () {
        console.log(this.start_time);
        var time = new Date(this.start_time);
        console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
        this.selected_time = this.start_time + ":00";
    };
    /** seeker match request */
    AddAppointmentPage.prototype.createAppointment = function () {
        var _this = this;
        if (this.selected_time == undefined) {
            this.alert.showAlert("Error", "Please select appoinment time");
        }
        else {
            var params = {
                sender_id: this.user.user_id,
                receiver_id: this.navParams.get('reciever_id'),
                property_id: this.navParams.get('property_id'),
                date: this.selected_date,
                time: this.selected_time
            };
            this.loader.presentLoading();
            this.user.callApi(params, 'appointment').subscribe(function (data) {
                _this.loader.dimissLoading();
                if (data.status != 0) {
                    _this.alert.showAlert("Message", "Appointment Created");
                    _this.sendMessage(data.data.id);
                }
                else {
                    _this.alert.showAlert("Error", data.message);
                }
            }, function (err) {
                _this.loader.dimissLoading();
                _this.alert.showAlert("Error", "Server is not responding");
                console.log(err);
            });
        }
    };
    /** send message */
    AddAppointmentPage.prototype.sendMessage = function (appoinment_id) {
        var _this = this;
        var d = new Date(this.selected_date);
        var options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric",
        };
        var date_of_appointment = d.toLocaleTimeString("en-us", options).substring(0, d.toLocaleTimeString("en-us", options).lastIndexOf(",") + 1);
        var params = {
            sender_id: this.user.user_id,
            receiver_id: this.navParams.get('reciever_id'),
            message: "An appointment has been created,Please confirm?" + date_of_appointment + this.start_time,
            property_id: this.navParams.get('property_id'),
            appointment_id: appoinment_id
        };
        this.user.callApi(params, 'chat').subscribe(function (data) {
            if (data.status != 0) {
                if (_this.navParams.get('path') == 'profile') {
                    _this.navCtrl.push("chat-view", { property_id: _this.navParams.get('property_id'), id: _this.navParams.get('reciever_id'), title: _this.navParams.get('chat_title') }).then(function () {
                        var index = _this.navCtrl.getActive().index;
                        _this.navCtrl.remove(index - 1);
                    });
                }
                else {
                    _this.navCtrl.push("chat-view", { property_id: _this.navParams.get('property_id'), id: _this.navParams.get('reciever_id'), title: _this.navParams.get('chat_title') }).then(function () {
                        var index = _this.navCtrl.getActive().index;
                        _this.navCtrl.remove(index - 1);
                        _this.navCtrl.remove(index - 2);
                    });
                }
            }
        }, function (err) {
            console.log(err);
        });
    };
    AddAppointmentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-add-appointment',
            templateUrl: 'add-appointment.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, NavParams, UserProvider, ApiProvider, AlertProvider, LoaderProvider])
    ], AddAppointmentPage);
    return AddAppointmentPage;
}());
export { AddAppointmentPage };
//# sourceMappingURL=add-appointment.js.map