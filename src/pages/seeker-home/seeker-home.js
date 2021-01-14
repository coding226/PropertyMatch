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
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { SwingStackComponent, Direction } from 'angular2-swing';
import { TranslateService } from '@ngx-translate/core';
var SeekerHomePage = /** @class */ (function () {
    function SeekerHomePage(translate, navCtrl, navParams, modalCtrl, api, user, alert, loader) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.api = api;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.properties = [];
        this.cards = [];
        this.recentCard = '';
        this.imageUrl = "";
        this.errormsg = '';
        this.pageNo = 1;
        translate.setDefaultLang(localStorage.language);
        this.imageUrl = this.api.API;
        this.stackConfig = {
            allowedDirections: [Direction.LEFT, Direction.RIGHT],
            throwOutConfidence: function (offsetX, offsetY, element) {
                return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
            },
            transform: function (element, x, y, r) {
                _this.onItemMove(element, x, y, r);
            },
            throwOutDistance: function (d) {
                return 800;
            }
        };
    }
    SeekerHomePage.prototype.ngOnInit = function () {
        // this.getProperties();
    };
    SeekerHomePage.prototype.ngAfterViewInit = function () {
        this.swingStack.throwin.subscribe(function (event) {
            event.target.style.background = '#ffffff';
        });
        // this.getProperties();
    };
    SeekerHomePage.prototype.ionViewWillEnter = function () {
        this.getProperties();
    };
    SeekerHomePage.prototype.onItemMove = function (element, x, y, r) {
        var color = '';
        var abs = Math.abs(x);
        var min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
        var hexCode = this.decimalToHex(min, 2);
        if (x < 0) {
            color = '#FF' + hexCode + hexCode;
        }
        else {
            color = '#' + hexCode + 'FF' + hexCode;
        }
        element.style.background = color;
        element.style['transform'] = "translate3d(0, 0, 0) translate(" + x + "px, " + y + "px) rotate(" + r + "deg)";
    };
    // Connected through HTML
    SeekerHomePage.prototype.decimalToHex = function (d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    };
    /** get properties */
    SeekerHomePage.prototype.getProperties = function (reset) {
        var _this = this;
        if (reset === void 0) { reset = 0; }
        var params = {
            // user_id: this.user.user_id,
            page: this.pageNo,
            reset: reset,
        };
        this.api.get(params, 'api/explorer/' + this.user.user_id).subscribe(function (data) {
            if (data.status === 200) {
                if (data.data.length > 0) {
                    _this.properties = __spreadArrays(data.data.reverse());
                    var hasIds = _this.cards.map(function (item) { return item.id; });
                    var list = [];
                    for (var i = 0; i < _this.properties.length; i++) {
                        if (hasIds.indexOf(_this.properties[i].id) < 0) {
                            list.push({
                                image_path: (_this.properties[i].mainimage.length > 0 && _this.properties[i].mainimage[0].image_path) ? _this.properties[i].mainimage[0].image_path : "",
                                title: _this.properties[i].title,
                                address: _this.properties[i].address,
                                id: _this.properties[i].id,
                                user_id: _this.properties[i].user_id,
                                alldata: _this.properties[i],
                            });
                        }
                    }
                    _this.cards = [].concat(list);
                }
                else {
                    _this.cards = [];
                }
                // this.cards=data.data;
                // console.log(this.cards)
            }
            else {
                _this.cards = [];
                // this.errormsg = data.error + 'Please change your search settings in profile.';
                // this.alert.showAlert("Error", 'Please change your search settings in profile.');
            }
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    /** go to property detail */
    SeekerHomePage.prototype.propertyDetail = function (detail) {
        var _this = this;
        var modal = this.modalCtrl.create("PropertyDetailPage", { detail: detail });
        modal.onDidDismiss(function (data) {
            if (data) {
                if (data.option == 'cancel') {
                    // this.voteUp(false, detail.id)
                    _this.cards.pop();
                }
                if (data.option == 'accept') {
                    _this.cards.pop();
                }
            }
        });
        modal.present();
    };
    SeekerHomePage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    SeekerHomePage.prototype.voteUp = function (like, propertyId) {
        this.makeRequest(this.user.user_id, propertyId, null);
    };
    SeekerHomePage.prototype.swipeRight = function (event) {
        var ids = event.target.id.split("|");
        this.makeRequest(ids[0], ids[1], 0);
    };
    SeekerHomePage.prototype.swipeLeft = function (event) {
        var ids = event.target.id.split("|");
        this.makeRequest(ids[0], ids[1], null);
    };
    SeekerHomePage.prototype.makeRequest = function (property_id, landlord_id, status) {
        var _this = this;
        // this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
            property_id: property_id,
            request: status
        };
        this.api.post(params, 'api/requests').subscribe(function (data) {
            // this.acceptRejectProperty(this.user.user_id, property_id, 1);
            if (data.status === 200) {
                _this.cards.pop();
            }
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    SeekerHomePage.prototype.acceptRejectProperty = function (userId, propertyId, type) {
        var _this = this;
        var params = {
            user_id: userId,
            property_id: propertyId,
            request: type
        };
        this.api.post(params, 'requests').subscribe(function (data) {
            _this.cards.pop();
            _this.checkPropertyLength();
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    SeekerHomePage.prototype.getPropertyString = function (propertyId) {
        if (this.user.property_type_array) {
            var prpertyTypes = this.user.property_type_array;
            var propertyTypeData = prpertyTypes.filter(function (arr) {
                return parseInt(arr.id) === propertyId;
            })[0];
            if (propertyTypeData) {
                return propertyTypeData.title;
            }
        }
        return '';
    };
    SeekerHomePage.prototype.checkPropertyLength = function () {
        if (this.cards.length === 0) {
            this.pageNo++;
            this.getProperties(1);
        }
    };
    SeekerHomePage.prototype.printPrice = function (p) {
        if (p.alldata.property_for === '0') {
            return this.numberWithCommas(p.alldata.rent_cost);
        }
        else if (p.alldata.property_for === '1') {
            return this.numberWithCommas(p.alldata.buy_cost);
        }
        else {
            return this.numberWithCommas(p.alldata.buy_cost);
        }
    };
    SeekerHomePage.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    SeekerHomePage.prototype.setCenter = function ($event) {
    };
    __decorate([
        ViewChild('myswing1'),
        __metadata("design:type", SwingStackComponent)
    ], SeekerHomePage.prototype, "swingStack", void 0);
    __decorate([
        ViewChildren('mycards1'),
        __metadata("design:type", QueryList)
    ], SeekerHomePage.prototype, "swingCards", void 0);
    SeekerHomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-seeker-home',
            templateUrl: 'seeker-home.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, NavParams, ModalController, ApiProvider, UserProvider, AlertProvider, LoaderProvider])
    ], SeekerHomePage);
    return SeekerHomePage;
}());
export { SeekerHomePage };
//# sourceMappingURL=seeker-home.js.map
