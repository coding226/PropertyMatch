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
import { IonicPage, Content, NavController, NavParams, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ProfilePage } from '../../pages/profile/profile';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { ImagePicker } from '@ionic-native/image-picker';
import { TranslateService } from '@ngx-translate/core';
var EditPropertyPage = /** @class */ (function () {
    function EditPropertyPage(navCtrl, platform, actionSheetCtrl, navParams, transfer, camera, user, api, alert, loader, toast, translate, imagePicker) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.navParams = navParams;
        this.transfer = transfer;
        this.camera = camera;
        this.user = user;
        this.api = api;
        this.alert = alert;
        this.loader = loader;
        this.toast = toast;
        this.imagePicker = imagePicker;
        this.markers = [];
        this.show_map = false;
        this.landlord = {
            search_type: 1
        };
        this.oldPics = [];
        this.delPics = [];
        this.addSuccess = false;
        this.main_pictures = [];
        this.additional_pictures = [];
        this.utility_bill = [];
        this.attributes = [];
        this.onceShow = true;
        this.mainImageCount = 0;
        this.additionalImageCount = 0;
        this.propertyTitleError = false;
        this.propertyTypeError = false;
        this.descriptionError = false;
        this.sizeError = false;
        this.utilityBillError = false;
        this.displayLand = false;
        translate.setDefaultLang(localStorage.language);
        this.property_type_array = this.user.property_type_array;
    }
    Object.defineProperty(EditPropertyPage.prototype, "currentLanguage", {
        get: function () {
            return localStorage.language;
        },
        enumerable: true,
        configurable: true
    });
    EditPropertyPage.prototype.onPropertychange = function (ev) {
        if (ev == 5 || ev == 2)
            this.displayLand = true;
        else
            this.displayLand = false;
    };
    EditPropertyPage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    EditPropertyPage.prototype.loadMap = function () {
        var latLng = new google
            .maps
            .LatLng(this.landlord.latitude, this.landlord.longitude);
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
        this.placeMarker(this.landlord.latitude, this.landlord.longitude);
        this.show_map = true;
    };
    /** show map */
    EditPropertyPage.prototype.showMap = function () {
        if (!this.show_map) {
            this.loadMap();
        }
        else {
            this.show_map = false;
        }
    };
    /** get add */
    /** choose place */
    EditPropertyPage.prototype.choosePlace = function (place) {
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
    EditPropertyPage.prototype.placeMarker = function (lat, lng) {
        var env = this;
        var lt = parseFloat(lat);
        var lg = parseFloat(lng);
        var pos = {
            lat: lt,
            lng: lg
        };
        this
            .map
            .setCenter({ lat: lt, lng: lg });
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
    EditPropertyPage.prototype.getMarkerPostion = function () {
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
    EditPropertyPage.prototype.setLocation = function () {
        this.map.setCenter(this.markers[0].getPosition());
        this.show_map = false;
    };
    EditPropertyPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        var param = this.navParams.get('property');
        this.api.get({}, 'api/properties/' + param.id).subscribe(function (data) {
            _this.landlord.id = data.data.id;
            _this.landlord.title = data.data.title;
            _this.landlord.description = data.data.description;
            _this.landlord.house_no = data.data.room_no;
            _this.landlord.nearest_point = data.data.nearest_transport;
            _this.landlord.attributes = data.data.attributes;
            _this.landlord.latitude = data.data.lat;
            _this.landlord.longitude = data.data.lon;
            _this.landlord.city = data.data.city;
            _this.landlord.state = data.data.region;
            _this.landlord.country = data.data.country;
            _this.landlord.property_type = data.data.property_type;
            _this.landlord.search_type = data.data.property_for;
            _this.landlord.address = data.data.address;
            _this.landlord.floor = data.data.floor;
            _this.landlord.house_name = data.data.house_name;
            _this.landlord.bedrooms = data.data.bedroom;
            _this.landlord.studios = data.data.studio;
            _this.landlord.bathrooms = data.data.bathroom;
            _this.landlord.size = data.data.property_size;
            _this.landlord.sqm = data.data.property_sqm;
            _this.landlord.buy_cost = data.data.buy_cost;
            _this.landlord.rent_cost = data.data.rent_cost;
            _this.oldPics = data.data.images;
            _this.attributes = data.data.attributes.split(',');
            _this.attributes.forEach(function (attr, index) {
                var findIndex = _this.user.attribute.findIndex(function (item) { return item.id === attr; });
                if (findIndex >= 0) {
                    _this.user.attribute[findIndex].checked = true;
                }
            });
            _this.showMap();
        }, function (err) {
        });
    };
    EditPropertyPage.prototype.ionViewDidLeave = function () {
    };
    EditPropertyPage.prototype.removeOldImage = function (pic) {
        var index = this.oldPics.findIndex(function (item) { return item.id === pic.id; });
        this.oldPics.splice(index, 1);
        this.delPics.push(pic);
    };
    /** edit pitcure */
    EditPropertyPage.prototype.uploadPicture = function (key) {
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
    EditPropertyPage.prototype.takePicture = function (sourceType, key) {
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
            }
            else {
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
            }
        }, function (err) {
            console.log('Error while selecting image');
        });
    };
    EditPropertyPage.prototype.pickImageFromibrary = function (key) {
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
    EditPropertyPage.prototype.uploadImage = function (id, path, name, key) {
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
                                'image_type': key
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
                                        // this.alert.showAlert('Message', "Property edited successfully");
                                        // this.landlord = '';
                                        // this.navCtrl.setRoot(TabsPage);
                                        _this.navCtrl.setRoot(ProfilePage);
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
    EditPropertyPage.prototype.uploadUtilityImage = function (id, path, name, key) {
        return __awaiter(this, void 0, void 0, function () {
            var options, fileTransfer;
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
                                'image_type': key
                            }
                        };
                        fileTransfer = this.transfer.create();
                        return [4 /*yield*/, fileTransfer
                                .upload(path, this.api.BASE_URL + 'propertyimages', options)
                                .then(function (data) {
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
    EditPropertyPage.prototype.addNewProperty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.loader.presentLoading();
                this.getAttributes().then(function (data) {
                    var params = {
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
                        del_pics: _this.delPics.map(function (item) { return item.id; }),
                        buy_cost: _this.landlord.buy_cost == undefined ? "" : _this.landlord.buy_cost,
                        rent_cost: _this.landlord.rent_cost == undefined ? "" : _this.landlord.rent_cost
                    };
                    _this.api.put(params, 'api/properties/' + _this.landlord.id).subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _i, i, _c, _d, _e, j, _f, _g, _h, k;
                        var _this = this;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    if (!(data.status != 0)) return [3 /*break*/, 16];
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
                                            message: 'Property edited successfully',
                                            duration: 3000,
                                            position: 'top'
                                        });
                                        _this.loader.dimissLoading();
                                        _this.navCtrl.pop();
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
                        console.log(err);
                        _this.alert.showAlert('Error', err);
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    /** set attribute */
    EditPropertyPage.prototype.setAttribute = function (attr, i) {
        if (this.user.attribute[i].checked) {
            this.user.attribute[i].checked = false;
        }
        else {
            this.user.attribute[i].checked = true;
        }
    };
    /* get attributes**/
    EditPropertyPage.prototype.getAttributes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var checkedAttributes = _this.user.attribute.filter(function (x) { return x.checked == true; });
            var checkedAttributesId = checkedAttributes.map(function (item) { return item.id; });
            _this.landlord.attributes = checkedAttributesId.join(',');
            resolve(_this.landlord.attributes);
        });
    };
    /** get latitude longitude */
    EditPropertyPage.prototype.getCoordinates = function () {
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
                else {
                    resolve(env.landlord);
                }
            });
        });
    };
    /** get regin city country */
    EditPropertyPage.prototype.getCountry = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
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
    EditPropertyPage.prototype.removeImage = function (index, imageType) {
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
    ], EditPropertyPage.prototype, "content", void 0);
    __decorate([
        ViewChild('mapEl'),
        __metadata("design:type", ElementRef)
    ], EditPropertyPage.prototype, "mapElement", void 0);
    EditPropertyPage = __decorate([
        IonicPage({
            name: "edit-property"
        }),
        Component({
            selector: 'page-edit-property',
            templateUrl: 'edit-property.html',
        }),
        __metadata("design:paramtypes", [NavController,
            Platform,
            ActionSheetController,
            NavParams,
            FileTransfer,
            Camera,
            UserProvider,
            ApiProvider,
            AlertProvider,
            LoaderProvider,
            ToastController,
            TranslateService,
            ImagePicker])
    ], EditPropertyPage);
    return EditPropertyPage;
}());
export { EditPropertyPage };
//# sourceMappingURL=edit-property.js.map