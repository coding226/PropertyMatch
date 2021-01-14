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
import { TabsPage } from '../tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
var DemoPage = /** @class */ (function () {
    function DemoPage(translate, navCtrl, navParams, modalCtrl, api, user, alert, loader) {
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
        this.imageUrl = this.api.IMAGE_URL;
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
    DemoPage.prototype.ngOnInit = function () {
    };
    DemoPage.prototype.ngAfterViewInit = function () {
    };
    DemoPage.prototype.ionViewWillEnter = function () {
        var timestamp = Date.now() + Math.random();
        if (!localStorage.user_id) {
            localStorage.setItem('demo_id', timestamp + '');
            this.swingStack.throwin.subscribe(function (event) {
                event.target.style.background = '#ffffff';
            });
            this.cards = [];
            this.getProperties(localStorage.demo_id);
        }
        else {
            this.navCtrl.setRoot(TabsPage);
        }
    };
    DemoPage.prototype.onItemMove = function (element, x, y, r) {
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
    DemoPage.prototype.voteUp = function ($event) {
        this.swipeLeft($event);
    };
    DemoPage.prototype.decimalToHex = function (d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    };
    /** get properties */
    DemoPage.prototype.getProperties = function (demo_id) {
        var _this = this;
        this.user.callApi({
            demo_id: demo_id
        }, 'demo').subscribe(function (data) {
            if (data.status != 0) {
                var list = __spreadArrays(data.data);
                var cards = [];
                if (list.length > 0) {
                    list.reverse();
                    var hasIds = list.map(function (item) { return item.id; });
                    for (var i = 0; i < list.length; i++) {
                        if (hasIds.indexOf(list[i].id) >= 0) {
                            cards.push({
                                image_path: (list[i].mainimage.length > 0 && list[i].mainimage[0].image_path) ? list[i].mainimage[0].image_path : "",
                                title: list[i].title,
                                address: list[i].address,
                                id: list[i].id,
                                user_id: list[i].user_id,
                                alldata: list[i],
                            });
                        }
                    }
                    _this.properties = __spreadArrays(list);
                    _this.cards = __spreadArrays(cards);
                }
                else {
                    _this.cards = [];
                }
            }
            else {
                _this.cards = [];
            }
        }, function (err) {
            _this.alert.showAlert("Error", 'Server not responding');
        });
    };
    /** go to property detail */
    DemoPage.prototype.propertyDetail = function (detail) {
        var _this = this;
        var modal = this.modalCtrl.create("PropertyDetailPage", { detail: detail });
        modal.onDidDismiss(function (data) {
            if (data) {
                if (data.option == 'cancel') {
                    _this.swipeLeft(null);
                }
                if (data.option == 'accept') {
                    _this.cards.pop();
                }
                _this.checkPropertyLength();
            }
        });
        modal.present();
    };
    /** make request */
    DemoPage.prototype.makeRequest = function ($event) {
        this.swipeRight($event);
    };
    DemoPage.prototype.swipeRight = function (event) {
        this.navCtrl.push("GetstartedPage");
        this.checkPropertyLength();
    };
    DemoPage.prototype.swipeLeft = function (event) {
        var ids = event.target.id.split("|");
        this.acceptRejectProperty(localStorage.demo_id, ids[0], 0);
        this.checkPropertyLength();
    };
    DemoPage.prototype.acceptRejectProperty = function (userId, propertyId, type) {
        // let params = {
        // 	user_id: localStorage.demo_id,
        // 	property_id: propertyId,
        // 	request: type
        // }
        this.cards.pop();
    };
    DemoPage.prototype.getPropertyString = function (propertyId) {
        var prpertyTypes = this.user.property_type_array;
        var propertyTypeData = prpertyTypes.filter(function (arr) {
            return arr.id == propertyId;
        })[0];
        return propertyTypeData.title;
    };
    DemoPage.prototype.checkPropertyLength = function () {
        if (this.cards.length === 0) {
            this.navCtrl.push("GetstartedPage");
        }
    };
    DemoPage.prototype.goToSettings = function () {
        this.navCtrl.push("GetstartedPage");
    };
    DemoPage.prototype.title = function (p) {
        return p.title;
    };
    DemoPage.prototype.printPrice = function (p) {
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
    DemoPage.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    __decorate([
        ViewChild('myswing1'),
        __metadata("design:type", SwingStackComponent)
    ], DemoPage.prototype, "swingStack", void 0);
    __decorate([
        ViewChildren('mycards1'),
        __metadata("design:type", QueryList)
    ], DemoPage.prototype, "swingCards", void 0);
    DemoPage = __decorate([
        IonicPage({
            name: 'demo'
        }),
        Component({
            selector: 'demo',
            templateUrl: 'demo.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, NavParams, ModalController, ApiProvider, UserProvider, AlertProvider, LoaderProvider])
    ], DemoPage);
    return DemoPage;
}());
export { DemoPage };
//# sourceMappingURL=demo.js.map