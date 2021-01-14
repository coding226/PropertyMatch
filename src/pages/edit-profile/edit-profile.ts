import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
	occupation_array: any;
	minDate = new Date().toISOString();
	descriptionError: boolean = false;
	dobError: boolean = false;
	occupationError: boolean = false;
	genderError: boolean = false;
	statusError: boolean = false;

	constructor(translate: TranslateService, public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private transfer: FileTransfer, public actionSheetCtrl: ActionSheetController, private camera: Camera, public api: ApiProvider, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider) {
		translate.setDefaultLang(localStorage.language);
	}

	ionViewWillEnter() {
		this.api.get({}, 'api/occupations').subscribe(res => {
			if (res.status === 200) {
				this.occupation_array = res.data;
			}
		}, err => {
			console.log(err);
		});
		this.api.get({}, '/api/users/' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				setTimeout(() => {
					this.user.short_description = data.data.description;
					this.user.status = data.data.status;
					this.user.gender = data.data.gender;
					this.user.occupation = data.data.occupation;
					this.user.dob = data.data.dob;
					this.user.profile_image = data.data.profile_image;
					this.user.website_link = data.data.website_link;
					this.user.facebook_link = data.data.facebook_link;
					this.user.youtube_link = data.data.youtube_link;
					this.user.instagram_link = data.data.instagram_link;
					this.user.twitter_link = data.data.twitter_link;
					this.user.additional_notes = data.data.additional_notes;
					this.user.street = data.data.street;
					this.user.zip_code = data.data.zip_code;
					this.user.city = data.data.city;
					this.user.country = data.data.country;
					this.user.billing_street = data.data.billing_street;
					this.user.billing_zip_code = data.data.billing_zip_code;
					this.user.billing_city = data.data.billing_city;
					this.user.billing_country = data.data.billing_country;
				}, 10)
			}
		}, err => {
			console.log(err);
		});
	}
	goToSettings() {
		this.navCtrl.push("SettingsPage");
	}

	/** edit profile */
	editProfile() {
		/*if (!this.user.short_description) {
			this.descriptionError = true;
			this.alert.showAlert('Error', 'Short Description is required!');
			return false
		}
		if (!this.user.dob) {
			this.dobError = true;
			this.alert.showAlert('Error', 'Birthday of date is required!');
			return false
		}
		if (!this.user.occupation) {
			this.occupationError = true;
			this.alert.showAlert('Error', 'Occupation is required!');
			return false
		}
		if (!this.user.status) {
			this.statusError = true;
			this.alert.showAlert('Error', 'Status is required!');
			return false;
		}*/
		this.loader.presentLoading()
		let params = {
			name: this.user.name,
			description: this.user.short_description,
			dob: this.user.dob,
			status: this.user.status,
			occupation: this.user.occupation,
			gender: this.user.gender,
			website_link: this.user.website_link,
			facebook_link: this.user.facebook_link,
			youtube_link: this.user.youtube_link,
			instagram_link: this.user.instagram_link,
			twitter_link: this.user.twitter_link,
			additional_notes: this.user.additional_notes,
			street: this.user.street,
			zip_code: this.user.zip_code,
			city: this.user.city,
			country: this.user.country,
			billing_street: this.user.billing_street,
			billing_zip_code: this.user.billing_zip_code,
			billing_city: this.user.billing_city,
			billing_country: this.user.billing_country,
		}
		this.api.put(params, 'api/users/' + this.user.user_id).subscribe(data => {
			this.loader.dimissLoading();
			if (data.status != 0) {
				this.user.name = data.data.name;
				this.user.short_description = data.data.description;
				this.user.status = data.data.status;
				this.user.gender = data.data.gender;
				this.user.occupation = data.data.occupation;
				this.user.profile_image = data.data.profile_image;
				this.user.website_link = data.data.website_link;
				this.user.facebook_link = data.data.facebook_link;
				this.user.youtube_link = data.data.youtube_link;
				this.user.instagram_link = data.data.instagram_link;
				this.user.twitter_link = data.data.twitter_link;
				this.user.additional_notes = data.data.additional_notes;
				this.user.street = data.data.street;
				this.user.zip_code = data.data.zip_code;
				this.user.city = data.data.city;
				this.user.country = data.data.country;
				this.user.billing_street = data.data.billing_street;
				this.user.billing_zip_code = data.data.billing_zip_code;
				this.user.billing_city = data.data.billing_city;
				this.user.billing_country = data.data.billing_country;
				this.alert.showAlert('Message', 'Profile edited successfully');
			} else {
				this.alert.showAlert('Error', data.error);
			}
		}, err => {
			this.loader.dimissLoading();
			this.alert.showAlert('Error', 'Server not responding');
		})
	}

	/** edit pitcure */
	editPicture() {
		let actionSheet = this
		.actionSheetCtrl
		.create({
			title: 'Select Image Source',
			buttons: [
			{
				text: 'Load from Library',
				handler: () => {
					this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
				}
			}, {
				text: 'Use Camera',
				handler: () => {
					this.takePicture(this.camera.PictureSourceType.CAMERA);
				}
			}, {
				text: 'Cancel',
				role: 'cancel'
			}
			]
		});
		actionSheet.present();
	}

	// Create options for the Camera Dialog
	public async takePicture(sourceType) {

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
		.then((imagePath) => {
			// Special handling for Android library
			if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
				let correctPath = imagePath;
				let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
				this.user.profile_image = correctPath;
				this.uploadImage(correctPath, currentName);
			} else {
				let correctPath = imagePath;
				this.user.profile_image = correctPath;
				let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
				this.uploadImage(correctPath, currentName);
			}
		}, (err) => {
			console.log('Error while selecting image');
		});
	}

	/** upload image */
	async uploadImage(path, name) {
		this.loader.presentLoading();
		var options = {
			fileKey: "profile",
			fileName: name,
			chunkedMode: false,
			mimeType: "multipart/form-data",
		};

		const fileTransfer: FileTransferObject = this.transfer.create();

		fileTransfer.upload(path, this.api.IMAGE_UPLOAD_API + 'api/users/' + this.user.user_id + '/profile', options)
			.then(result => {
				const data = JSON.parse(result.response);
				if (data.status === 200) {
					this.user.profile_image = data.data.images;
				}
				this.loader.dimissLoading();
			}, err => {
				this.loader.dimissLoading();
				this.alert.showAlert("Error", 'Server is not responding');
			});
	}

	getProfile() {
		if (this.user.profile_image != null) {
			return this.api.IMAGE_URL + this.user.profile_image
		} else {
			return 'assets/imgs/profile.jpg';
		}
	}
}
