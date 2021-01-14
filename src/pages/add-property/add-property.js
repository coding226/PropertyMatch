var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { ImagePicker } from '@ionic-native/image-picker';
import { TranslateService } from '@ngx-translate/core';
var AddPropertyPage = /** @class */ (function () {
    function AddPropertyPage(navCtrl, platform, geolocation, actionSheetCtrl, navParams, transfer, camera, user, api, alert, loader, toast, translate, imagePicker) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.geolocation = geolocation;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.transfer = transfer;
        this.camera = camera;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.toast = toast;
        this.translate = translate;
        this.imagePicker = imagePicker;
        this.markers = [];
        this.show_map = false;
        this.landlord = {
            search_type: 1
        };
        this.addSuccess = false;
        this.main_pictures = [];
        this.additional_pictures = [];
        this.utility_bill = [];
        this.onceShow = true;
        this.mainImageCount = 0;
        this.additionalImageCount = 0;
        this.propertyTitleError = false;
        this.propertyTypeError = false;
        this.descriptionError = false;
        this.studioError = false;
        this.sizeError = false;
        this.utilityBillError = false;
        this.displayLand = false;
        translate.setDefaultLang(localStorage.language);
        this.property_type_array = this.user.property_type_array;
    }
    Object.defineProperty(AddPropertyPage.prototype, "currentLanguage", {
        get: function () {
            return localStorage.language;
        },
        enumerable: true,
        configurable: true
    });
    AddPropertyPage.prototype.onPropertychange = function (ev) {
        if (ev == 5 || ev == 2)
            this.displayLand = true;
        else
            this.displayLand = false;
    };
    AddPropertyPage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    AddPropertyPage.prototype.ionViewDidEnter = function () {
        var daft = localStorage.daftAdd;
        try {
            var parse = JSON.parse(daft);
            this.landlord = __assign({}, parse);
        }
        catch (e) {
        }
    };
    AddPropertyPage.prototype.ionViewDidLeave = function () {
        if (!this.addSuccess) {
            localStorage.setItem('daftAdd', JSON.stringify(this.landlord));
        }
        else {
            localStorage.removeItem('daftAdd');
        }
    };
    AddPropertyPage.prototype.loadMap = function () {
        var latLng = new google
            .maps
            .LatLng(this.user.latitude, this.user.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 10,
            streetViewControl: false,
            disableDefaultUI: true
        };
        // this.map = new google
        // .maps
        // .Map(this.mapElement.nativeElement, mapOptions);
        this.map = new google
            .maps
            .Map(document.querySelector('#mapDiv'), mapOptions);
        this.placeMarker(this.user.latitude, this.user.longitude);
        this.show_map = true;
    };
    /** show map */
    AddPropertyPage.prototype.showMap = function () {
        if (!this.show_map) {
            this.loadMap();
        }
        else {
            this.show_map = false;
        }
    };
    /** get add */
    /** choose place */
    AddPropertyPage.prototype.choosePlace = function (place) {
        this.user.city = place.structured_formatting.main_text;
        this.user.state = place.structured_formatting.secondary_text;
        var env = this;
        var geocoder = new google.maps.Geocoder();
        var address = place.description;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                var pos = {
                    lat: latitude,
                    lng: longitude
                };
                env.user.latitude = latitude;
                env.user.longitude = longitude;
                env.landlord.latitude = latitude;
                env.landlord.longitude = longitude;
                env.show_map = false;
                env.showMap();
                env.placeMarker(latitude, longitude);
            }
        });
    };
    /** palce marker of searcg location */
    AddPropertyPage.prototype.placeMarker = function (lat, lng) {
        var env = this;
        var lt = parseFloat(lat);
        var lg = parseFloat(lng);
        var pos = {
            lat: lt,
            lng: lg
        };
        this.map.setCenter({ lat: lt, lng: lg });
        this.markers = [
            new google
                .maps
                .Marker({ position: pos, draggable: false, map: this.map })
        ];
        var markers = this.markers;
        var map = this.map;
        this.map.addListener('drag', function () {
            markers[0].setPosition({
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng(),
            });
        });
        this.map.addListener('dragend', function () {
            env.getMarkerPostion();
        });
        this.map.addListener('zoom_changed', function () {
            setTimeout(function () {
                map.panTo(markers[0].getPosition());
            }, 500);
        });
        google.maps.event.addListener(this.markers, 'dragend', function () {
            env.getMarkerPostion();
            setTimeout(function () {
                map.panTo(markers[0].getPosition());
            }, 500);
        });
    };
    AddPropertyPage.prototype.getMarkerPostion = function () {
        var env = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: this.markers[0].getPosition()
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                env.user.latitude = latitude;
                env.user.longitude = longitude;
                env.landlord.latitude = latitude;
                env.landlord.longitude = longitude;
                if (results[1]) {
                    var a = results[1].address_components;
                    if (a[1]) {
                        env.landlord.city = a[1].short_name;
                    }
                    if (a[2]) {
                        env.landlord.state = a[2].long_name;
                    }
                    if (a[3]) {
                        env.landlord.country = a[3].long_name;
                    }
                }
            }
        });
    };
    AddPropertyPage.prototype.setLocation = function () {
        this.map.setCenter(this.markers[0].getPosition());
        this.show_map = false;
    };
    /** edit pitcure */
    AddPropertyPage.prototype.uploadPicture = function (key) {
        var _this = this;
        if (key == 1) {
            if (this.main_pictures.length == 1) {
                this.alert.showAlert("Message", "You can not upload more than 1 main images");
            }
            else {
                var actionSheet = this
                    .actionSheetCtrl
                    .create({
                    title: 'Select Image Source',
                    buttons: [
                        {
                            text: 'Load from Library',
                            handler: function () {
                                // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
                                _this.pickImageFromibrary(key);
                            }
                        }, {
                            text: 'Use Camera',
                            handler: function () {
                                _this.takePicture(_this.camera.PictureSourceType.CAMERA, key);
                            }
                        }, {
                            text: 'Cancel',
                            role: 'cancel'
                        }
                    ]
                });
                actionSheet.present();
            }
        }
        else if (key == 2) {
            if (this.additional_pictures.length == 9) {
                this.alert.showAlert("Message", "You can not upload more than 9 additional images");
            }
            else {
                var actionSheet = this
                    .actionSheetCtrl
                    .create({
                    title: 'Select Image Source',
                    buttons: [
                        {
                            text: 'Load from Library',
                            handler: function () {
                                // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
                                _this.pickImageFromibrary(key);
                            }
                        }, {
                            text: 'Use Camera',
                            handler: function () {
                                _this.takePicture(_this.camera.PictureSourceType.CAMERA, key);
                            }
                        }, {
                            text: 'Cancel',
                            role: 'cancel'
                        }
                    ]
                });
                actionSheet.present();
            }
        }
        else {
            this.utilityBillError = false;
            if (this.utility_bill.length == 3) {
                this.alert.showAlert("Message", "You can not upload more than 3 Utility images");
            }
            else {
                var actionSheet = this
                    .actionSheetCtrl
                    .create({
                    title: 'Select Image Source',
                    buttons: [
                        {
                            text: 'Load from Library',
                            handler: function () {
                                // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
                                _this.pickImageFromibrary(key);
                            }
                        }, {
                            text: 'Use Camera',
                            handler: function () {
                                _this.takePicture(_this.camera.PictureSourceType.CAMERA, key);
                            }
                        }, {
                            text: 'Cancel',
                            role: 'cancel'
                        }
                    ]
                });
                actionSheet.present();
            }
        }
    };
    // Create options for the Camera Dialog
    AddPropertyPage.prototype.takePicture = function (sourceType, key) {
        var _this = this;
        var options = {
            quality: 50,
            sourceType: sourceType,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imagePath) {
            if (sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                //  this.crop.crop(imagePath, {quality: 75})
                //      .then(
                //       newImage =>{
                var correctPath = imagePath.split('?');
                var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                if (key == 1) {
                    _this.main_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else if (key == 2) {
                    _this.additional_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else {
                    _this.utility_bill.push({ title: currentName, path: correctPath[0] });
                }
                // console.log(this.main_pictures);
                // console.log(this.additional_pictures);
                //  })
            }
            else {
                // this.crop.crop(imagePath, {quality: 75})
                //  .then(
                //   newImage =>{
                var correctPath = imagePath.split('?');
                var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                if (key == 1) {
                    _this.main_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else if (key == 2) {
                    _this.additional_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else {
                    _this.utility_bill.push({ title: currentName, path: correctPath[0] });
                }
                //   })
            }
        }, function (err) {
            console.log('Error while selecting image');
        });
    };
    AddPropertyPage.prototype.pickImageFromibrary = function (key) {
        var _this = this;
        var options = {
            maximumImagesCount: (key == 1) ? 1 : 9,
            quality: 50
        };
        this.imagePicker.getPictures(options).then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var correctPath = results[i].split('?');
                var currentName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].lastIndexOf('?'));
                if (key == 1) {
                    _this.main_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else if (key == 2) {
                    _this.additional_pictures.push({ title: currentName, path: correctPath[0] });
                }
                else {
                    _this.utility_bill.push({ title: currentName, path: correctPath[0] });
                }
            }
        }, function (err) {
            console.log("Error in selecting Image", err);
        });
    };
    /** upload image */
    AddPropertyPage.prototype.uploadImage = function (id, path, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var options, fileTransfer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            fileKey: "property_image",
                            fileName: name,
                            chunkedMode: false,
                            mimeType: "multipart/form-data",
                            params: {
                                'user_id': this.user.user_id,
                                'property_id': id,
                                'type': key
                            }
                        };
                        fileTransfer = this.transfer.create();
                        return [4 /*yield*/, fileTransfer
                                .upload(path, this.api.API + 'propertyimages', options)
                                .then(function (data) {
                                console.log("fileTransfer.upload success", data);
                                // if(this.mainImageCount ==  this.main_pictures.length && this.additionalImageCount == this.additional_pictures.length) {
                                if (_this.mainImageCount == _this.main_pictures.length) {
                                    if (_this.onceShow) {
                                        // this.onceShow = false;
                                        // this.loader.dimissLoading();
                                        // this.alert.showAlert('Message', "Property addedd successfully");
                                        // this.landlord = '';
                                        // this.navCtrl.setRoot(TabsPage);
                                        // this.navCtrl.popToRoot();
                                    }
                                }
                            }, function (err) {
                                console.log("fileTransfer.upload err", err);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AddPropertyPage.prototype.uploadUtilityImage = function (id, path, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var options, fileTransfer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            fileKey: "property_image",
                            fileName: name,
                            chunkedMode: false,
                            mimeType: "multipart/form-data",
                            params: {
                                'user_id': this.user.user_id,
                                'property_id': id,
                                'type': key
                            }
                        };
                        fileTransfer = this.transfer.create();
                        return [4 /*yield*/, fileTransfer
                                .upload(path, this.api.BASE_URL + 'propertyimages', options)
                                .then(function (data) {
                                console.log("fileTransfer.upload success", data);
                                // if(this.mainImageCount ==  this.main_pictures.length && this.additionalImageCount == this.additional_pictures.length) {
                                if (_this.mainImageCount == _this.main_pictures.length) {
                                    if (_this.onceShow) {
                                        _this.onceShow = false;
                                        // this.loader.dimissLoading();
                                        // this.alert.showAlert('Message', "Property addedd successfully");
                                        _this.landlord = '';
                                        // this.navCtrl.setRoot(TabsPage);
                                        // this.navCtrl.popToRoot();
                                    }
                                }
                            }, function (err) {
                                console.log("fileTransfer.upload err", err);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** add property */
    AddPropertyPage.prototype.addNewProperty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.loader.presentLoading();
                this.getAttributes().then(function (data) {
                    var params = {
                        user_id: _this.user.user_id,
                        title: _this.landlord.title,
                        description: _this.landlord.description,
                        room_no: _this.landlord.house_no,
                        nearest_transport: _this.landlord.nearest_point,
                        attributes: _this.landlord.attributes,
                        lat: _this.landlord.latitude,
                        lon: _this.landlord.longitude,
                        city: _this.landlord.city,
                        region: _this.landlord.state,
                        country: _this.landlord.country,
                        property_type: _this.landlord.property_type,
                        property_for: _this.landlord.search_type,
                        address: _this.landlord.address,
                        floor: _this.landlord.floor,
                        house_name: _this.landlord.house_name,
                        bedroom: _this.landlord.bedrooms || 0,
                        studio: _this.landlord.studios || 0,
                        bathroom: _this.landlord.bathrooms || 0,
                        property_size: _this.landlord.size || 0,
                        property_sqm: _this.landlord.sqm || 0,
                        buy_cost: _this.landlord.buy_cost == undefined ? "" : _this.landlord.buy_cost,
                        rent_cost: _this.landlord.rent_cost == undefined ? "" : _this.landlord.rent_cost
                    };
                    _this.api.post(params, 'api/properties').subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _i, i, _c, _d, _e, j, _f, _g, _h, k;
                        var _this = this;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    if (!(data.status === 200)) return [3 /*break*/, 16];
                                    if (!(this.main_pictures.length != 0)) return [3 /*break*/, 5];
                                    _a = [];
                                    for (_b in this.main_pictures)
                                        _a.push(_b);
                                    _i = 0;
                                    _j.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                    i = _a[_i];
                                    if (!(this.main_pictures[i].path != undefined)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.uploadImage(data.data.id, this.main_pictures[i].path, this.main_pictures[i].title, 1)];
                                case 2:
                                    _j.sent();
                                    this.mainImageCount = this.mainImageCount + 1;
                                    return [3 /*break*/, 4];
                                case 3: return [2 /*return*/];
                                case 4:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 5:
                                    if (!(this.additional_pictures.length != 0)) return [3 /*break*/, 10];
                                    _c = [];
                                    for (_d in this.additional_pictures)
                                        _c.push(_d);
                                    _e = 0;
                                    _j.label = 6;
                                case 6:
                                    if (!(_e < _c.length)) return [3 /*break*/, 10];
                                    j = _c[_e];
                                    if (!(this.additional_pictures[j].path != undefined)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, this.uploadImage(data.data.id, this.additional_pictures[j].path, this.additional_pictures[j].title, 0)];
                                case 7:
                                    _j.sent();
                                    this.additionalImageCount = this.additionalImageCount + 1;
                                    return [3 /*break*/, 9];
                                case 8: return [2 /*return*/];
                                case 9:
                                    _e++;
                                    return [3 /*break*/, 6];
                                case 10:
                                    if (!(this.utility_bill.length != 0)) return [3 /*break*/, 15];
                                    _f = [];
                                    for (_g in this.utility_bill)
                                        _f.push(_g);
                                    _h = 0;
                                    _j.label = 11;
                                case 11:
                                    if (!(_h < _f.length)) return [3 /*break*/, 15];
                                    k = _f[_h];
                                    if (!(this.utility_bill[k].path != undefined)) return [3 /*break*/, 13];
                                    return [4 /*yield*/, this.uploadUtilityImage(data.data.id, this.utility_bill[k].path, this.utility_bill[k].title, 2)];
                                case 12:
                                    _j.sent();
                                    return [3 /*break*/, 14];
                                case 13: return [2 /*return*/];
                                case 14:
                                    _h++;
                                    return [3 /*break*/, 11];
                                case 15:
                                    setTimeout(function () {
                                        _this.addSuccess = true;
                                        _this.toast.create({
                                            message: 'Property added successfully',
                                            duration: 3000,
                                            position: 'top'
                                        });
                                        _this.loader.dimissLoading();
                                        _this.navCtrl.popToRoot();
                                    }, 500);
                                    return [3 /*break*/, 17];
                                case 16:
                                    this.alert.showAlert('Error', data.error);
                                    this.loader.dimissLoading();
                                    _j.label = 17;
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); }, function (err) {
                        _this.loader.dimissLoading();
                        _this.alert.showAlert('Error', err);
                    });
                    // })
                });
                return [2 /*return*/];
            });
        });
    };
    /** set attribute */
    AddPropertyPage.prototype.setAttribute = function (attr, i) {
        if (this.user.attribute[i].checked) {
            this.user.attribute[i].checked = false;
        }
        else {
            this.user.attribute[i].checked = true;
        }
    };
    /* get attributes**/
    AddPropertyPage.prototype.getAttributes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var checkedAttributes = _this.user.attribute.filter(function (x) { return x.checked == true; });
            var checkedIds = '';
            checkedAttributes.filter(function (x) {
                checkedIds = checkedIds.toString() + x.id.toString();
                checkedIds = checkedIds.toString() + ',';
            });
            _this.landlord.attributes = checkedIds;
            resolve(_this.landlord.attributes);
        });
    };
    /** get latitude longitude */
    AddPropertyPage.prototype.getCoordinates = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var env = _this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': _this.landlord.address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    env.landlord.latitude = latitude;
                    env.landlord.longitude = longitude;
                    resolve(env.landlord);
                }
            });
        });
    };
    /** get regin city country */
    AddPropertyPage.prototype.getCountry = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var env = _this;
            var lat = _this.landlord.latitude;
            var lng = _this.landlord.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var a = results[1].address_components;
                    env.landlord.city = a[1].short_name;
                    env.landlord.state = a[3].long_name;
                    env.landlord.country = a[4].long_name;
                    resolve(env.landlord);
                }
            });
        });
    };
    AddPropertyPage.prototype.removeImage = function (index, imageType) {
        switch (imageType) {
            case "main_pictures":
                this.main_pictures.splice(index, 1);
                break;
            case "additional_pictures":
                this.additional_pictures.splice(index, 1);
                break;
            case "utility_bill":
                this.utility_bill.splice(index, 1);
                if (this.utility_bill.length == 0) {
                    this.utilityBillError = true;
                }
                break;
            case "main_pictures":
                break;
        }
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], AddPropertyPage.prototype, "content", void 0);
    __decorate([
        ViewChild('mapEl'),
        __metadata("design:type", ElementRef)
    ], AddPropertyPage.prototype, "mapElement", void 0);
    AddPropertyPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-add-property',
            templateUrl: 'add-property.html',
        }),
        __metadata("design:paramtypes", [NavController,
            Platform,
            Geolocation,
            ActionSheetController,
            NavParams,
            FileTransfer,
            Camera, UserProvider,
            ApiProvider, AlertProvider, LoaderProvider,
            ToastController,
            TranslateService,
            ImagePicker])
    ], AddPropertyPage);
    return AddPropertyPage;
}());
export { AddPropertyPage };
//# sourceMappingURL=add-property.js.map