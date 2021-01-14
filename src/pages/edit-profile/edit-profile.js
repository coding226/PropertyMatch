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
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { FileTransfer } from '@ionic-native/file-transfer';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
var EditProfilePage = /** @class */ (function () {
    function EditProfilePage(translate, navCtrl, platform, nativeStorage, navParams, transfer, actionSheetCtrl, crop, camera, api, user, alert, loader) {
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.nativeStorage = nativeStorage;
        this.navParams = navParams;
        this.transfer = transfer;
        this.actionSheetCtrl = actionSheetCtrl;
        this.crop = crop;
        this.camera = camera;
        this.api = api;
        this.user = user;
        this.alert = alert;
        this.loader = loader;
        this.minDate = new Date().toISOString();
        this.descriptionError = false;
        this.dobError = false;
        this.occupationError = false;
        this.genderError = false;
        this.statusError = false;
        translate.setDefaultLang(localStorage.language);
        // console.log(this.navParams.get('profile_data'));
    }
    EditProfilePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.api.get({}, '/api/occupations/').subscribe(function (res) {
            if (res.status === 200) {
                _this.occupation_array = res.data;
            }
        }, function (err) {
            console.log(err);
        });
        this.api.get({}, '/api/users/' + this.user.user_id).subscribe(function (data) {
            if (data.status === 200) {
                setTimeout(function () {
                    _this.user.short_description = data.data.description;
                    _this.user.status = data.data.status;
                    _this.user.gender = data.data.gender;
                    _this.user.occupation = data.data.occupation;
                    _this.user.dob = data.data.dob;
                    _this.user.profile_image = data.data.profile_image;
                }, 10);
            }
        }, function (err) {
            console.log(err);
        });
    };
    EditProfilePage.prototype.goToSettings = function () {
        this.navCtrl.push("SettingsPage");
    };
    /** edit profile */
    EditProfilePage.prototype.editProfile = function () {
        var _this = this;
        if (!this.user.short_description) {
            this.descriptionError = true;
            return false;
        }
        if (!this.user.dob) {
            this.dobError = true;
            return false;
        }
        if (!this.user.occupation) {
            this.occupationError = true;
            return false;
        }
        if (!this.user.gender) {
            this.genderError = true;
            return false;
        }
        if (!this.user.status) {
            this.statusError = true;
            return false;
        }
        this.loader.presentLoading();
        var params = {
            description: this.user.short_description,
            dob: this.user.dob,
            status: this.user.status,
            occupation: this.user.occupation,
            gender: this.user.gender
        };
        this.api.put(params, 'api/users/' + this.user.user_id).subscribe(function (data) {
            _this.loader.dimissLoading();
            if (data.status != 0) {
                // this.nativeStorage.clear();
                // this.nativeStorage.setItem('user_data', { data: data.data })
                // 	.then(
                // 		() => console.log('Stored item!'),
                // 		error => console.error('Error storing item', error)
                // 	);
                _this.user.user_id = data.data.id;
                _this.user.name = data.data.name;
                _this.user.short_description = data.data.description;
                _this.user.status = data.data.status;
                _this.user.gender = data.data.gender;
                _this.user.occupation = data.data.occupation;
                // this.user.dob = data.data.dob;
                _this.user.profile_image = data.data.profile_image;
                _this.alert.showAlert('Message', 'Profile edited successfully');
            }
            else {
                _this.alert.showAlert('Error', data.error);
                //this.navCtrl.setRoot("VerificationNumberPage",{id:data.data.id});
            }
        }, function (err) {
            _this.loader.dimissLoading();
            console.log(err);
            _this.alert.showAlert('Error', 'Server not responding');
        });
    };
    /** edit pitcure */
    EditProfilePage.prototype.editPicture = function () {
        var _this = this;
        var actionSheet = this
            .actionSheetCtrl
            .create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                }, {
                    text: 'Use Camera',
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    // Create options for the Camera Dialog
    EditProfilePage.prototype.takePicture = function (sourceType) {
        var _this = this;
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
        // Get the data of an image
        this
            .camera
            .getPicture(options)
            .then(function (imagePath) {
            // Special handling for Android library
            if (sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.crop.crop(imagePath, { quality: 75 })
                    .then(function (newImage) {
                    var correctPath = newImage;
                    var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
                    _this.user.profile_image = correctPath;
                    _this.uploadImage(correctPath, currentName);
                });
            }
            else {
                _this.crop.crop(imagePath, { quality: 75 })
                    .then(function (newImage) {
                    var correctPath = newImage;
                    _this.user.profile_image = correctPath;
                    var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
                    _this.uploadImage(correctPath, currentName);
                });
            }
        }, function (err) {
            console.log('Error while selecting image');
        });
    };
    /** upload image */
    EditProfilePage.prototype.uploadImage = function (path, name) {
        var _this = this;
        this.loader.presentLoading();
        console.log(path, name);
        var options = {
            fileKey: "profile_image",
            fileName: name,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {
                'user_id': this.user.user_id
            }
        };
        console.log("options", options);
        var fileTransfer = this
            .transfer
            .create();
        fileTransfer
            .upload(path, this.api.BASE_URL + 'upload_profile_image', options)
            .then(function (data) {
            console.log("fileTransfer.upload success", data);
            _this.loader.dimissLoading();
            // this.alert.showAlert("Message", 'Upload succesfully');
        }, function (err) {
            console.log("fileTransfer.upload err", err);
            _this.loader.dimissLoading();
            _this.alert.showAlert("Error", 'Server is not responding');
        });
    };
    EditProfilePage.prototype.getProfile = function () {
        if (this.user.profile_image != null) {
            return this.api.API + this.user.profile_image;
        }
        else {
            return 'assets/imgs/profile.jpg';
        }
    };
    EditProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-profile',
            templateUrl: 'edit-profile.html',
        }),
        __metadata("design:paramtypes", [TranslateService, NavController, Platform, NativeStorage, NavParams, FileTransfer, ActionSheetController, Crop, Camera, ApiProvider, UserProvider, AlertProvider, LoaderProvider])
    ], EditProfilePage);
    return EditProfilePage;
}());
export { EditProfilePage };
//# sourceMappingURL=edit-profile.js.map