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
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
var PropertyDetailPage = /** @class */ (function () {
    function PropertyDetailPage(translate, navCtrl, navParams, api, user, alert, alertCtrl, loader, viewCtrl, imageViewerCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.api = api;
        this.user = user;
        this.alert = alert;
        this.alertCtrl = alertCtrl;
        this.loader = loader;
        this.viewCtrl = viewCtrl;
        this.imageViewerCtrl = imageViewerCtrl;
        this.attributes = [];
        this.main_images = [];
        this.additional_images = [];
        this.imageUrl = "";
        this.from = "";
        translate.setDefaultLang(localStorage.language);
        this._imageViewerCtrl = imageViewerCtrl;
        this.imageUrl = this.api.API;
        this.detail = this.navParams.get('detail');
        this.likedProperty = this.navParams.get('likedProperty');
        var attributes = this.detail.attributes.split(',');
        this.main_images = this.detail.mainimage;
        this.additional_images = this.detail.additionalimage;
        console.log("this.detail", this.detail);
        console.log("this.additional_images", this.additional_images);
        for (var x in this.user.attribute) {
            for (var y in attributes) {
                if (this.user.attribute[x].id == attributes[y]) {
                    this.attributes.push({ id: this.user.attribute[x].id, title: this.user.attribute[x].title });
                }
            }
        }
        console.log(this.attributes);
        this.from = this.navParams.get('from');
    }
    PropertyDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PropertyDetailPage');
    };
    /** close  */
    PropertyDetailPage.prototype.close = function () {
        this.navCtrl.pop();
    };
    /** make request */
    PropertyDetailPage.prototype.makeRequest = function (status) {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
            request: status,
            property_id: this.detail.id
        };
        this.api.post(params, 'api/requests').subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status === 200) {
                _this.closeModal((status === 0) ? 'accept' : 'cancel');
            }
            else {
                _this.alert.showAlert("Error", data.error);
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    PropertyDetailPage.prototype.closeModal = function (option) {
        var data = { 'option': option };
        this.viewCtrl.dismiss(data);
    };
    PropertyDetailPage.prototype.showConfirm = function (propertyId) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirm',
            subTitle: '',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Report',
                    handler: function () {
                        _this.reportProperty(propertyId);
                    }
                }
            ]
        });
        alert.present();
    };
    PropertyDetailPage.prototype.reportProperty = function (propertyId) {
        var _this = this;
        var params = {
            id: propertyId
        };
        this.loader.presentLoading();
        this.user.callApi(params, 'report_user').subscribe(function (data) {
            _this.loader.dimissLoading();
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    PropertyDetailPage.prototype.getPropertyString = function (propertyId) {
        var prpertyTypes = this.user.property_type_array;
        var propertyTypeData = prpertyTypes.filter(function (arr) {
            return arr.id == propertyId;
        })[0];
        return propertyTypeData.title;
    };
    PropertyDetailPage.prototype.getPropertyFor = function (propertyFor) {
        if (propertyFor == 1) {
            return "Sale";
        }
        else if (propertyFor == 0) {
            return "Rent";
        }
        else {
            return "Both";
        }
    };
    PropertyDetailPage.prototype.acceptRejectProperty = function (userId, propertyId, type) {
        var _this = this;
        var params = {
            user_id: userId,
            property_id: propertyId,
            request: type
        };
        this.user.callApi(params, 'property_accept_reject').subscribe(function (data) {
            console.log(data);
            _this.closeModal('accept');
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    PropertyDetailPage.prototype.setCenter = function ($event) {
        console.log($event);
    };
    PropertyDetailPage.prototype.presentImage = function (myImage, $event) {
        var imageViewer = this._imageViewerCtrl.create($event.target);
        imageViewer.present();
        imageViewer.onDidDismiss(function () {
        });
    };
    PropertyDetailPage.prototype.printPrice = function (p) {
        if (p.property_for === '0') {
            return this.numberWithCommas(p.rent_cost);
        }
        else if (p.property_for === '1') {
            return this.numberWithCommas(p.buy_cost);
        }
        else {
            return this.numberWithCommas(p.buy_cost);
        }
    };
    PropertyDetailPage.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    PropertyDetailPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-property-detail',
            templateUrl: 'property-detail.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            NavController,
            NavParams,
            ApiProvider,
            UserProvider,
            AlertProvider,
            AlertController,
            LoaderProvider,
            ViewController,
            ImageViewerController])
    ], PropertyDetailPage);
    return PropertyDetailPage;
}());
export { PropertyDetailPage };
//# sourceMappingURL=property-detail.js.map
