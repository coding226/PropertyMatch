var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TranslateService } from '@ngx-translate/core';
import { ApiProvider } from './../../providers/api/api';
var ProfilePage = /** @class */ (function () {
    function ProfilePage(translate, alertCtrl, navCtrl, geolocation, nativeStorage, navParams, api, user, alert, loader) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.nativeStorage = nativeStorage;
        this.navParams = navParams;
        this.api = api;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.showSaved = false;
        this.selectedType = [];
        this.show_map = false;
        this.user_mode = 'seeker';
        this.landlord_section = 'chats';
        this.show_upper_section = true;
        this.show_buy_price = false;
        this.show_rent_price = true;
        this.show_back = false;
        this.request_type = 'matched';
        this.show_manageRequest = false;
        this.total_requests = 0;
        this.selected_property = {};
        this.hideMap = false;
        this.onceShow = true;
        this.markers = [];
        translate.setDefaultLang(localStorage.language);
        if (this.navParams.get('rootFrom') == 'message') {
            this.user_mode = 'landlord';
            // this.show_manageRequest = true;
            this.show_manageRequest = false;
        }
        this.priceRange = user.priceRange;
    }
    ProfilePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.showSaved = false;
        this.user.hideTabs = false;
        if (this.navParams.get('rootFrom') == 'message') {
            this.user_mode = 'landlord';
            // this.show_manageRequest = true;
            this.show_manageRequest = false;
            this.hideUpperSection(this.navParams.get('data'));
        }
        else {
            this.show_manageRequest = false;
            this.show_upper_section = true;
        }
        this.api.get({}, 'api/users/' + localStorage.user_id).subscribe(function (res) {
            var data = res.data;
            _this.selectedType = data.property_type.split(",");
            _this.profile_data = data;
            _this.user.user_id = data.id;
            _this.user.name = data.name;
            _this.user.short_description = data.description;
            _this.user.status = data.status;
            _this.user.gender = data.gender;
            _this.user.occupation = data.occupation;
            _this.user.age = data.age;
            _this.user.profile_image = data.profile_image;
            _this.user.search_type = data.search_type;
            _this.user.search_range = parseInt(data.search_range);
            if (data.min_price && data.min_price != 'undefined') {
                _this.user.price_range = data.min_price;
            }
            else {
                _this.user.price_range = "";
            }
            if (data.max_price && data.max_price != 'undefined') {
                _this.user.price_range2 = data.max_price;
            }
            else {
                _this.user.price_range2 = "";
            }
            if (data.city != null) {
                _this.user.city = data.city;
            }
            if (data.region != null) {
                _this.user.state = data.region;
            }
            if (data.country != null) {
                _this.user.country = data.country;
            }
            if (data.rent_duration != null) {
                _this.user.rent_duration = data.rent_duration;
            }
            if (data.lat != null && data.lon != null) {
                _this.user.latitude = data.lat;
                _this.user.longitude = data.lon;
                //  this.loadMap();
            }
            else {
                _this.getCurrentPosition();
            }
            if (data.attributes) {
                var array = data.attributes.split(',');
                for (var _i = 0, _a = _this.user.attribute; _i < _a.length; _i++) {
                    var a = _a[_i];
                    for (var _b = 0, array_1 = array; _b < array_1.length; _b++) {
                        var b = array_1[_b];
                        if (b == a.id) {
                            a.checked = true;
                        }
                    }
                }
            }
        }, function (err) {
            console.log(err);
        });
        this.getLandlordProperties();
        this.getMatchedRequests();
        this.timeDuration = setInterval(function () {
            _this.getLandlordProperties();
            _this.getMatchedRequests();
        }, 10000);
    };
    ProfilePage.prototype.ionViewDidLeave = function () {
        if (this.timeDuration) {
            clearInterval(this.timeDuration);
        }
    };
    Object.defineProperty(ProfilePage.prototype, "currentLanguage", {
        get: function () {
            return localStorage.language;
        },
        enumerable: true,
        configurable: true
    });
    ProfilePage.prototype._apiDeleteProperty = function (property_id) {
        var _this = this;
        this.api.delete('api/properties/' + property_id).subscribe(function (data) {
            if (data.status === 200) {
                _this.getLandlordProperties();
                _this.getMatchedRequests();
            }
        }, function (err) {
            _this.alert.showAlert("Error", "Server is not responding");
        });
    };
    ProfilePage.prototype.deleteProperty = function (property) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Confirm to delete ?',
            message: 'Confirm to delete this property.',
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
                        _this._apiDeleteProperty(property.id);
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    ProfilePage.prototype.editProperty = function (p) {
        this.navCtrl.push("edit-property", {
            property: p
        });
    };
    /** get landlord properties */
    ProfilePage.prototype.getLandlordProperties = function () {
        var _this = this;
        this.api.get({ user_id: this.user.user_id }, 'api/properties').subscribe(function (data) {
            if (data.status != 0) {
                _this.landlord_all_properties = data.data;
            }
        }, function (err) {
            console.log(err);
        });
    };
    /** get current position */
    ProfilePage.prototype.getCurrentPosition = function () {
        var _this = this;
        console.log('Current Postion');
        var env = this;
        this.geolocation.getCurrentPosition().then(function (resp) {
            // console.log("getCurrentPosition", resp);
            _this.user.latitude = resp.coords.latitude;
            _this.user.longitude = resp.coords.longitude;
            var lat = _this.user.latitude;
            var lng = _this.user.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var a = results[1].address_components;
                    // console.log(a);
                    env.user.city = a[1].short_name;
                    env.user.state = a[2].long_name;
                    env.user.country = a[3].long_name;
                    if (results[1]) {
                        // console.log(results[1]);
                        // console.log("Location: " + results[1].formatted_address);
                    }
                }
            });
            //  this.loadMap();
        }).catch(function (error) {
            console.log('Error getting location', error);
        });
    };
    ProfilePage.prototype.loadMap = function () {
        // console.log("loadMap", this.user.latitude, this.user.longitude, this.user.city, this.user.country);
        var latLng = new google
            .maps
            .LatLng(this.user.latitude, this.user.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 10,
            streetViewControl: false,
            disableDefaultUI: true
        };
        this.map = new google
            .maps
            .Map(this.mapElement.nativeElement, mapOptions);
        this.placeMarker(this.user.latitude, this.user.longitude);
        this.hideMap = true;
    };
    /** palce marker of searcg location */
    ProfilePage.prototype.placeMarker = function (lat, lng) {
        var geocoder = new google.maps.Geocoder();
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
    ProfilePage.prototype.getMarkerPostion = function () {
        var env = this;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: this.markers[0].getPosition()
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                if (results[1]) {
                    var a = results[1].address_components;
                    env.user.latitude = latitude;
                    env.user.longitude = longitude;
                    if (a[1]) {
                        env.user.city = a[1].short_name;
                    }
                    if (a[2]) {
                        env.user.state = a[2].long_name;
                    }
                    if (a[3]) {
                        env.user.country = a[3].long_name;
                    }
                }
                // env.setLocation();
            }
            else {
            }
        });
    };
    /** edit profile */
    ProfilePage.prototype.editProfile = function () {
        this.navCtrl.push("EditProfilePage", { profile_data: this.profile_data });
    };
    ProfilePage.prototype.getProfile = function () {
        if (this.user.profile_image != null) {
            return this.api.API + this.user.profile_image;
        }
        else {
            return 'assets/imgs/profile.jpg';
        }
    };
    /** show map */
    ProfilePage.prototype.showMap = function () {
        this.show_map = true;
        this.loadMap();
    };
    /** get add */
    /** choose place */
    ProfilePage.prototype.choosePlace = function (place) {
        this.user.city = place.structured_formatting.main_text;
        this.user.state = place.structured_formatting.secondary_text;
        var env = this;
        var geocoder = new google.maps.Geocoder();
        var address = place.description;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                // console.log(latitude, longitude);
                var pos = {
                    lat: latitude,
                    lng: longitude
                };
                // console.log(pos);
                env.user.latitude = latitude;
                env.user.longitude = longitude;
                env.hideMap = false;
                env.loadMap();
                env.placeMarker(latitude, longitude);
            }
        });
    };
    /** set search type */
    ProfilePage.prototype.setSearchType = function () {
        if (this.user.search_type == '1') {
            this.show_buy_price = true;
            this.show_rent_price = false;
        }
        else {
            this.show_rent_price = true;
            this.show_buy_price = false;
        }
        var params = {
            search_type: this.user.search_type
        };
        this.commonUpdateAPI(params);
    };
    /** set property type */
    ProfilePage.prototype.setPropertyType = function () {
        var params = {
            property_type: this.selectedType.join(',')
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.setRentDuration = function () {
        var params = {
            rent_duration: this.user.rent_duration
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.changeSearchRang = function () {
        this.setSearchRange(this.user);
        /*
        if (this.timeOutSearchRange) {
            clearTimeout(this.timeOutSearchRange);
        }

        this.timeOutSearchRange = setTimeout(() => {
            this.setSearchRange(this.user)
        }, 2000);
        */
    };
    ProfilePage.prototype.setSearchRange = function (user) {
        var params = {
            search_range: user.search_range
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.setBedrooms = function () {
        var params = {
            bedroom: this.user.bedroom
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.setStudios = function () {
        var params = {
            studio: this.user.studio
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.setBathrooms = function () {
        var params = {
            bathroom: this.user.bathroom
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.setSqm = function () {
        var params = {
            sqm: this.user.sqm
        };
        this.commonUpdateAPI(params);
    };
    ProfilePage.prototype.commonUpdateAPI = function (params) {
        this.api.put(params, 'api/users/' + localStorage.user_id).subscribe(function (data) {
            // console.log(data);
            // this.nativeStorage.clear();
            // this.nativeStorage.setItem('user_data', { data: data.data })
            // .then(
            // 	() => console.log('Stored item!'),
            // 	error => console.error('Error storing item', error)
            // 	);
        }, function (err) {
            console.log(err);
        });
    };
    /** set price range */
    ProfilePage.prototype.setPriceRange = function () {
        if (this.show_buy_price) {
            var params = {
                min_price: parseInt(this.user.price_range),
                max_price: parseInt(this.user.price_range2)
            };
            this.commonUpdateAPI(params);
        }
        else {
            var params = {
                min_price: parseInt(this.user.price_range),
                max_price: parseInt(this.user.price_range2)
            };
            this.commonUpdateAPI(params);
        }
    };
    /** set attribute */
    ProfilePage.prototype.setAttribute = function (attr, index) {
        var attrs = this.user.attribute;
        if (attr.checked) {
            var findIndex = attrs.findIndex(function (item) { return item.id === attr.id; });
            this.user.attribute[findIndex].checked = false;
        }
        else {
            var findIndex = attrs.findIndex(function (item) { return item.id === attr.id; });
            this.user.attribute[findIndex].checked = true;
        }
        var getChecked = attrs.filter(function (item) { return item.checked === true; })
            .map(function (item) { return item.id; });
        var params = {
            attributes: getChecked.join(',')
        };
        this.commonUpdateAPI(params);
    };
    /** set location */
    ProfilePage.prototype.setLocation = function () {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            user_id: this.user.user_id,
            city: this.user.city,
            region: this.user.state,
            country: this.user.country,
            lat: this.user.latitude,
            lon: this.user.longitude,
        };
        this.user.callApi(params, 'edit_seeker_profile').subscribe(function (data) {
            _this.loader.dimissLoading();
            _this.nativeStorage.clear();
            _this.nativeStorage.setItem('user_data', { data: data.data })
                .then(function () { return console.log('Stored item!'); }, function (error) { return console.error('Error storing item', error); });
            _this.navCtrl.setRoot(_this.navCtrl.getActive().component);
            _this.hideMap = true;
        }, function (err) {
            console.log(err);
            _this.loader.dimissLoading();
            _this.alert.showAlert('Error', 'Server Error');
        });
    };
    /** got to add neww property */
    ProfilePage.prototype.addNewProperty = function () {
        this.navCtrl.push("AddPropertyPage");
    };
    /** hide upper section */
    ProfilePage.prototype.hideUpperSection = function (data) {
        console.log(data);
        this.show_upper_section = false;
        this.selected_property = data;
    };
    /** go back to landlord section*/
    ProfilePage.prototype.goToLandlord = function () {
        this.show_upper_section = true;
    };
    /** add appointment */
    ProfilePage.prototype.addAppointment = function (property_id, reciever_id, chat_title) {
        this.navCtrl.push("AddAppointmentPage", { reciever_id: reciever_id, property_id: property_id, chat_title: chat_title, path: 'profile' });
    };
    /** chats */
    ProfilePage.prototype.chat = function (id, title) {
        this.navCtrl.push("chat-view", { property_id: this.selected_property.id, id: id, title: title });
    };
    /** getMatchedProperties */
    ProfilePage.prototype.showMatchedProperties = function () {
        this.show_back = true;
        if (this.show_manageRequest) {
            this.show_manageRequest = false;
        }
        else {
            this.show_manageRequest = true;
        }
    };
    ProfilePage.prototype.hideBack = function () {
        this.show_back = false;
        if (this.show_manageRequest) {
            this.show_manageRequest = false;
        }
        else {
            this.show_manageRequest = true;
        }
    };
    ProfilePage.prototype.viewPendingRequest = function () {
        this.show_upper_section = true;
        this.show_manageRequest = true;
    };
    ProfilePage.prototype.getMatchedRequests = function () {
        var _this = this;
        this.total_requests = 0;
        this.api.get({ landlord_id: this.user.user_id }, 'api/requests').subscribe(function (data) {
            if (data.status === 200) {
                if (data.data.length != 0) {
                    _this.matched_requests = data.data;
                    _this.total_requests = 0;
                    for (var a in _this.matched_requests) {
                        for (var b in _this.matched_requests[a].requests) {
                            if (_this.matched_requests[a].requests) {
                                _this.total_requests = _this.total_requests + 1;
                            }
                        }
                    }
                }
            }
        }, function (err) {
            console.log(err);
        });
    };
    /** decline accept request */
    ProfilePage.prototype.declineAcceptRequest = function (id, status, seeker_name) {
        var _this = this;
        this.loader.presentLoading();
        var params = {
            status: status
        };
        console.log(params);
        this.api.put(params, 'api/requests/' + id).subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status === 200) {
                _this.getMatchedRequests();
                // 	this.matched_requests = data.data;
                // 	for (let a in this.matched_requests) {
                // 		for (let b in this.matched_requests[a].requests) {
                // 			this.total_requests = this.total_requests + 1;
                // 		}
                // 	}
                // 	this.getMatchedRequests();
                // 	this.alert.showAlert("Message", "You have accepted the " + seeker_name + " request");
                // } else {
                // 	this.alert.showAlert("Error", data.error);
            }
        }, function (err) {
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", "Server is not responding");
            console.log(err);
        });
    };
    /** go to settings */
    ProfilePage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    ProfilePage.prototype.acceptOrRejectAppointment = function (appointment, index, option) {
        var _this = this;
        var params = {
            appointment_id: appointment.appointment_id,
            message_id: appointment.id,
            request: option
        };
        this.user.callApi(params, 'appointment_accept_reject').subscribe(function (data) {
            if (data.status != 0) {
                _this.selected_property.appointment_user[index].appointment_status = 2;
            }
        }, function (err) {
            console.log(err);
        });
    };
    ProfilePage.prototype.checkType = function () {
        return (this.selectedType.indexOf('3') >= 0 ||
            this.selectedType.indexOf('6') >= 0 ||
            this.selectedType.indexOf('7') >= 0);
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ProfilePage.prototype, "content", void 0);
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], ProfilePage.prototype, "mapElement", void 0);
    ProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-profile',
            templateUrl: 'profile.html',
        }),
        __metadata("design:paramtypes", [TranslateService,
            AlertController,
            NavController,
            Geolocation,
            NativeStorage,
            NavParams,
            ApiProvider,
            UserProvider,
            AlertProvider,
            LoaderProvider])
    ], ProfilePage);
    return ProfilePage;
}());
export { ProfilePage };
//# sourceMappingURL=profile.js.map