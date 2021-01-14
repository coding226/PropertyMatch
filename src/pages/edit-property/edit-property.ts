import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Content, NavController, NavParams, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { ProfilePage } from '../../pages/profile/profile';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { ImagePicker } from '@ionic-native/image-picker';
import { TranslateService } from '@ngx-translate/core';


declare var google: any;

@IonicPage({
	name: "edit-property"
})
@Component({
	selector: 'page-edit-property',
	templateUrl: 'edit-property.html',
})
export class EditPropertyPage {
	@ViewChild(Content) content: Content;
	@ViewChild('mapEl') mapElement: ElementRef;
	markers = [];
	map: any;
	show_map: boolean = false;

	property_type_array: any;
	landlord: any = {
		search_type: 1
	};
	oldPics = [];
	delPics = [];
	addSuccess = false;
	main_pictures: any = [];
	additional_pictures: any = [];
	utility_bill: any = [];
	attributes = [];
	onceShow: boolean = true;
	mainImageCount: number = 0;
	additionalImageCount: number = 0; bill: any;

	propertyTitleError: boolean = false;
	propertyTypeError: boolean = false;
	descriptionError: boolean = false;
	sizeError: boolean = false;
	utilityBillError: boolean = false;
	displayLand: boolean = false;
	constructor(
		public navCtrl: NavController,
		public platform: Platform,
		public actionSheetCtrl: ActionSheetController,
		public navParams: NavParams,
		private transfer: FileTransfer,
		private camera: Camera,
		public user: UserProvider,
		public api: ApiProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider,
		public toast: ToastController,
		translate: TranslateService,
		public imagePicker: ImagePicker
		) {
		translate.setDefaultLang(localStorage.language);
		this.property_type_array = this.user.property_type_array;
	}

	get currentLanguage() {
		return localStorage.language;
	}

	onPropertychange(ev) {
		if (ev == 5 || ev == 2)
			this.displayLand = true;
		else
			this.displayLand = false;
	}

	goToSettings() {
		this.navCtrl.push("SettingsPage");
	}

	loadMap() {
		let latLng = new google
		.maps
		.LatLng(this.landlord.latitude, this.landlord.longitude);
		let mapOptions = {
			center: latLng,
			zoom: 15,
			streetViewControl: false,
			disableDefaultUI: true

		}
		this.map = new google
		.maps
		.Map(document.querySelector('#mapDiv'), mapOptions);
		this.placeMarker(this.landlord.latitude, this.landlord.longitude);
		this.show_map = true;
	}

	/** show map */
	showMap() {
		if (!this.show_map) {
			this.loadMap();
		} else {
			this.show_map = false;
		}
	}

	/** get add */
	/** choose place */
	choosePlace(place) {
		this.user.city = place.structured_formatting.main_text;
		this.user.state = place.structured_formatting.secondary_text;
		var env = this;
		var geocoder = new google.maps.Geocoder();
		var address = place.description;
		geocoder.geocode({ 'address': address }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				env.user.latitude = latitude;
				env.user.longitude = longitude;
				env.landlord.latitude = latitude;
				env.landlord.longitude = longitude;
				env.show_map = false;
				env.showMap();
				env.placeMarker(latitude, longitude);
			}
		});
	}


	/** palce marker of searcg location */
	placeMarker(lat, lng) {
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
		const markers = this.markers
		const map = this.map

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
			setTimeout(() => {
				map.panTo(markers[0].getPosition());
			}, 500);
		});
		google.maps.event.addListener(this.markers, 'dragend', function () {
			env.getMarkerPostion();
			setTimeout(() => {
				map.panTo(markers[0].getPosition());
			}, 500)
		});
	}

	getMarkerPostion() {
		var env = this;
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode
		({
			latLng: this.markers[0].getPosition()
		},
		function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				env.user.latitude = latitude;
				env.user.longitude = longitude;
				env.landlord.latitude = latitude;
				env.landlord.longitude = longitude;
				if (results[1]) {
					const a = results[1].address_components;
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
		}
		);
	}

	setLocation() {
		this.map.setCenter(this.markers[0].getPosition());
		// this.show_map = false;
	}

	ionViewDidEnter() {
		const param = this.navParams.get('property');
		this.api.get({}, 'api/properties/' + param.id).subscribe(data => {
			this.landlord.id = data.data.id;
			this.landlord.title = data.data.title;
			this.landlord.description = data.data.description;
			this.landlord.house_no = data.data.room_no;
			this.landlord.nearest_point = data.data.nearest_transport;
			this.landlord.attributes = data.data.attributes;
			this.landlord.latitude = data.data.lat;
			this.landlord.longitude = data.data.lon;
			this.landlord.city = data.data.city;
			this.landlord.state = data.data.region;
			this.landlord.country = data.data.country;
			this.landlord.property_type = data.data.property_type;
			this.landlord.search_type = data.data.property_for;
			this.landlord.address = data.data.address;
			this.landlord.floor = data.data.floor;
			this.landlord.house_name = data.data.house_name;
			this.landlord.bedrooms = data.data.bedroom;
			this.landlord.studios = data.data.studio;
			this.landlord.bathrooms = data.data.bathroom;
			this.landlord.size = data.data.property_size;
			this.landlord.sqm = data.data.property_sqm;
			this.landlord.buy_cost = data.data.buy_cost;
			this.landlord.rent_cost = data.data.rent_cost;
			this.oldPics = data.data.images;
			this.attributes = data.data.attributes.split(',');
			this.attributes.forEach((attr, index) => {
				const findIndex = this.user.attribute.findIndex(item => item.id === Number(attr));
				if (findIndex >= 0) {
					this.user.attribute[findIndex].checked = true;
				}
			});
			this.showMap();
		}, err => {
		})
	}

	ionViewDidLeave() {
	}

	removeOldImage(pic) {
		const index = this.oldPics.findIndex(item => item.id === pic.id);
		this.oldPics.splice(index, 1);
		this.delPics.push(pic);
	}

	/** edit pitcure */
	uploadPicture(key) {
		if (key == 1) {
			if (this.main_pictures.length == 1) {
				this.alert.showAlert("Message", "You can not upload more than 1 main images");
			} else {
				let actionSheet = this
				.actionSheetCtrl
				.create({
					title: 'Select Image Source',
					buttons: [
					{
						text: 'Load from Library',
						handler: () => {
							// this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
							this.pickImageFromibrary(key);
						}
					}, {
						text: 'Use Camera',
						handler: () => {
							this.takePicture(this.camera.PictureSourceType.CAMERA, key);
						}
					}, {
						text: 'Cancel',
						role: 'cancel'
					}
					]
				});
				actionSheet.present();
			}
		} else if (key == 2) {
			if (this.additional_pictures.length == 9) {
				this.alert.showAlert("Message", "You can not upload more than 9 additional images");
			} else {
				let actionSheet = this
				.actionSheetCtrl
				.create({
					title: 'Select Image Source',
					buttons: [
					{
						text: 'Load from Library',
						handler: () => {
							// this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
							this.pickImageFromibrary(key);
						}
					}, {
						text: 'Use Camera',
						handler: () => {
							this.takePicture(this.camera.PictureSourceType.CAMERA, key);
						}
					}, {
						text: 'Cancel',
						role: 'cancel'
					}
					]
				});
				actionSheet.present();
			}
		} else {
			this.utilityBillError = false;
			if (this.utility_bill.length == 3) {
				this.alert.showAlert("Message", "You can not upload more than 3 Utility images");
			} else {
				let actionSheet = this
				.actionSheetCtrl
				.create({
					title: 'Select Image Source',
					buttons: [
					{
						text: 'Load from Library',
						handler: () => {
							// this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, key);
							this.pickImageFromibrary(key);
						}
					}, {
						text: 'Use Camera',
						handler: () => {
							this.takePicture(this.camera.PictureSourceType.CAMERA, key);
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
	}

	// Create options for the Camera Dialog
	public takePicture(sourceType, key) {
		var options = {
			quality: 50,
			sourceType: sourceType,
			saveToPhotoAlbum: true,
			correctOrientation: true
		};
		this.camera.getPicture(options).then((imagePath) => {
			if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
				//  this.crop.crop(imagePath, {quality: 75})
				//      .then(
				//       newImage =>{
					let correctPath = imagePath.split('?');
					let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

					if (key == 1) {
						this.main_pictures.push({ title: currentName, path: correctPath[0] });
					} else if (key == 2) {
						this.additional_pictures.push({ title: currentName, path: correctPath[0] });
					} else {
						this.utility_bill.push({ title: currentName, path: correctPath[0] });
					}
				} else {
					let correctPath = imagePath.split('?');
					let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

					if (key == 1) {
						this.main_pictures.push({ title: currentName, path: correctPath[0] });
					} else if (key == 2) {
						this.additional_pictures.push({ title: currentName, path: correctPath[0] });
					} else {
						this.utility_bill.push({ title: currentName, path: correctPath[0] });
					}
				}
			}, (err) => {
				console.log('Error while selecting image');
			});
	}

	pickImageFromibrary(key) {
		let options = {
			maximumImagesCount: (key == 1) ? 1 : 9,
			quality: 50
		}
		this.imagePicker.getPictures(options).then((results) => {
			for (var i = 0; i < results.length; i++) {
				let correctPath = results[i].split('?');
				let currentName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].lastIndexOf('?'));
				if (key == 1) {
					this.main_pictures.push({ title: currentName, path: correctPath[0] });
				} else if (key == 2) {
					this.additional_pictures.push({ title: currentName, path: correctPath[0] });
				} else {
					this.utility_bill.push({ title: currentName, path: correctPath[0] });
				}
			}
		}, (err) => {
			console.log("Error in selecting Image", err);
		});
	}

	/** upload image */
	async uploadImage(id, path, name, key) {
		var options = {
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
		const fileTransfer: FileTransferObject = this.transfer.create();
		await fileTransfer
		.upload(path, this.api.IMAGE_UPLOAD_API + 'api/propertyimages', options)
		.then(data => {
			console.log("fileTransfer.upload success", data);
			// if(this.mainImageCount ==  this.main_pictures.length && this.additionalImageCount == this.additional_pictures.length) {
				if (this.mainImageCount == this.main_pictures.length) {
					if (this.onceShow) {
						// this.onceShow = false;
						// this.loader.dimissLoading();
						// this.alert.showAlert('Message', "Property edited successfully");
						// this.landlord = '';
						// this.navCtrl.setRoot(TabsPage);
						this.navCtrl.setRoot(ProfilePage);
					}
				}
			}, err => {
				console.log("fileTransfer.upload err", err);
			});
	}

	async uploadUtilityImage(id: any, path: any, name: any, key: any) {
		var options = {
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
		const fileTransfer: FileTransferObject = this.transfer.create();
		await fileTransfer
		.upload(path, this.api.IMAGE_UPLOAD_API + 'api/propertyimages', options)
		.then(data => {
		}, err => {
			console.log("fileTransfer.upload err", err);
		});
	}

	/** add property */
	async addNewProperty() {

		this.loader.presentLoading();
		this.getAttributes().then(data => {
			let params = {
				title: this.landlord.title,
				description: this.landlord.description,
				room_no: this.landlord.house_no,
				nearest_transport: this.landlord.nearest_point,
				attributes: this.landlord.attributes,
				lat: this.landlord.latitude,
				lon: this.landlord.longitude,
				city: this.landlord.city,
				region: this.landlord.state,
				country: this.landlord.country,
				property_type: this.landlord.property_type,
				property_for: this.landlord.search_type,
				address: this.landlord.address,
				floor: this.landlord.floor,
				house_name: this.landlord.house_name,
				bedroom: this.landlord.bedrooms || 0,
				studio: this.landlord.studios || 0,
				bathroom: this.landlord.bathrooms || 0,
				property_size: this.landlord.size || 0,
				property_sqm: this.landlord.sqm || 0,
				del_pics: this.delPics.map(item => item.id),
				buy_cost: this.landlord.buy_cost == undefined ? "" : this.landlord.buy_cost,
				rent_cost: this.landlord.rent_cost == undefined ? "" : this.landlord.rent_cost
			}
			this.api.put(params, 'api/properties/' + this.landlord.id).subscribe(async (data) => {
				if (data.status != 0) {
					console.log(this.main_pictures);
					if (this.main_pictures.length != 0) {
						for (var i in this.main_pictures) {
							if (this.main_pictures[i].path != undefined) {
								await this.uploadImage(data.data.id, this.main_pictures[i].path, this.main_pictures[i].title, 1);
								this.mainImageCount = this.mainImageCount + 1;
							} else {
								return
							}
						}
					}
					if (this.additional_pictures.length != 0) {
						for (var j in this.additional_pictures) {
							if (this.additional_pictures[j].path != undefined) {
								await this.uploadImage(data.data.id, this.additional_pictures[j].path, this.additional_pictures[j].title, 0);
								this.additionalImageCount = this.additionalImageCount + 1;
							} else {
								return;
							}
						}
					}

					if (this.utility_bill.length != 0) {
						for (var k in this.utility_bill) {
							if (this.utility_bill[k].path != undefined) {
								await this.uploadUtilityImage(data.data.id, this.utility_bill[k].path, this.utility_bill[k].title, 2);
							} else {
								return;
							}
						}
					}

					setTimeout(() => {
						this.addSuccess = true;
						this.toast.create({
							message: 'Property edited successfully',
							duration: 3000,
							position: 'top'
						});
						this.loader.dimissLoading();
						this.navCtrl.pop();
					}, 500);
				} else {
					this.alert.showAlert('Error', data.error);
					this.loader.dimissLoading();
				}
			}, err => {
				this.loader.dimissLoading();
				console.log(err);
				this.alert.showAlert('Error', err);
			})
		});
	}

	/** set attribute */
	setAttribute(attr, i) {
		if (this.user.attribute[i].checked) {
			this.user.attribute[i].checked = false;
		} else {
			this.user.attribute[i].checked = true;
		}
	}
	/* get attributes**/
	getAttributes() {
		return new Promise((resolve, reject) => {
			let checkedAttributes = this.user.attribute.filter(x => x.checked == true);
			const checkedAttributesId = checkedAttributes.map(item => item.id);
			this.landlord.attributes = checkedAttributesId.join(',');
			resolve(this.landlord.attributes);
		})
	}

	/** get latitude longitude */
	getCoordinates() {
		return new Promise((resolve, reject) => {
			var env = this;
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'address': this.landlord.address }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();
					env.landlord.latitude = latitude;
					env.landlord.longitude = longitude;
					resolve(env.landlord);
				} else {
					resolve(env.landlord);
				}
			});
		})
	}

	/** get regin city country */
	getCountry() {
		return new Promise((resolve, reject) => {
			var env = this;
			var lat = this.landlord.latitude;
			var lng = this.landlord.longitude;
			var latlng = new google.maps.LatLng(lat, lng);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let a = results[1].address_components;
					env.landlord.city = a[1].short_name;
					env.landlord.state = a[3].long_name;
					env.landlord.country = a[4].long_name;
					resolve(env.landlord);
				}
			});
		})
	}

	removeImage(index: any, imageType: string) {
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
	}
}
