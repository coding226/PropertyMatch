import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeStorage } from '@ionic-native/native-storage';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TranslateService } from '@ngx-translate/core';

declare var google: any;

import { ApiProvider } from './../../providers/api/api';
@IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})

export class ProfilePage {
	@ViewChild(Content) content: Content;
	@ViewChild('map') mapElement: ElementRef;
	showSaved = false;
	selectedType = [];
	map: any;
	show_map: boolean = false;
	user_mode: string = 'seeker';
	landlord_section: string = 'chats';
	show_upper_section: boolean = true;
	profile_data: number;
	show_buy_price: boolean = false;
	show_rent_price: boolean = true;
	city: string;
	state: string;
	country: string;
	lat: any;
	show_back: boolean = false;
	long: any;
	landlord_all_properties: any;
	request_type: string = 'matched';
	show_manageRequest: boolean = false;
	matched_requests: any;
	total_requests: number = 0;
	selected_property: any = {};
	hideMap: boolean = false;
	onceShow: boolean = true;
	priceRange: any;
	timeDuration: any;
	timeOutSearchRange: any;
	markers = [];

	constructor(
		translate: TranslateService,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public geolocation: Geolocation,
		private nativeStorage: NativeStorage,
		public navParams: NavParams,
		public api: ApiProvider,
		public user: UserProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider
		) {
		translate.setDefaultLang(localStorage.language);
		if (this.navParams.get('rootFrom') == 'message') {
			this.user_mode = 'landlord';
			this.show_manageRequest = false;
		}
		this.priceRange = user.priceRange
	}

	ionViewWillEnter() {
		this.showSaved = false;
		this.user.hideTabs = false;
		if (this.navParams.get('rootFrom') == 'message') {
			this.user_mode = 'landlord';
			// this.show_manageRequest = true;
			this.show_manageRequest = false;
			this.hideUpperSection(this.navParams.get('data'));
		} else {
			this.show_manageRequest = false;
			this.show_upper_section = true;
		}
		this.api.get({}, 'api/users/' + localStorage.user_id).subscribe(res => {
			const data = res.data
			this.selectedType = !!data.property_type? data.property_type.split(",") : '';
			this.profile_data = data;
			this.user.user_id = data.id;
			this.user.name = data.name;
			this.user.short_description = data.description;
			this.user.status = data.status;
			this.user.gender = data.gender;
			this.user.occupation = data.occupation;
			this.user.age = data.age;
			this.user.profile_image = data.profile_image;
			this.user.search_type = data.search_type;
			this.user.search_range = parseInt(data.search_range);

			if (data.min_price && data.min_price != 'undefined') {
				this.user.price_range = data.min_price;
			} else {
				this.user.price_range = "";
			}
			if (data.max_price && data.max_price != 'undefined') {
				this.user.price_range2 = data.max_price;
			} else {
				this.user.price_range2 = "";
			}
			if (data.city != null) {
				this.user.city = data.city;
			}
			if (data.region != null) {
				this.user.state = data.region;
			}
			if (data.country != null) {
				this.user.country = data.country;
			}
			if (data.rent_duration != null) {
				this.user.rent_duration = data.rent_duration;
			}

			if (data.lat != null && data.lon != null) {
				this.user.latitude = data.lat;
				this.user.longitude = data.lon;
				//  this.loadMap();
			} else {
				this.getCurrentPosition();
			}
			if (data.attributes) {
				let array = data.attributes.split(',');
				for (let a of this.user.attribute) {
					for (let b of array) {
						if (b == a.id) {
							a.checked = true;
						}
					}
				}
			}

		}, err => {
			console.log(err);
		});
		this.getLandlordProperties();
		this.getMatchedRequests();
		this.timeDuration = setInterval(() => {
			this.getLandlordProperties();
			this.getMatchedRequests();
		}, 10000)
	}
	ionViewDidLeave() {
		if (this.timeDuration) {
			clearInterval(this.timeDuration)
		}
	}

	get currentLanguage() {
		return localStorage.language;
	}

	private _apiDeleteProperty(property_id) {
		this.api.delete('api/properties/' + property_id).subscribe(data => {
			if (data.status === 200) {
				this.getLandlordProperties();
				this.getMatchedRequests();
			}
		}, err => {
			this.alert.showAlert("Error", "Server is not responding");
		})
	}

	deleteProperty(property) {
		const confirm = this.alertCtrl.create({
			title: 'Confirm to delete ?',
			message: 'Confirm to delete this property.',
			buttons: [
			{
				text: 'Disagree',
				handler: () => {
					console.log('Disagree clicked');
				}
			},
			{
				text: 'Agree',
				handler: () => {
					this._apiDeleteProperty(property.id);
					console.log('Agree clicked');
				}
			}
			]
		});

		confirm.present();
	}

	editProperty(p) {
		this.navCtrl.push("edit-property", {
			property: p
		});
	}

	/** get landlord properties */
	getLandlordProperties() {
		this.api.get({ user_id: this.user.user_id }, 'api/properties').subscribe(data => {
			if (data.status != 0) {
				this.landlord_all_properties = data.data;
			}
		}, err => {
			console.log(err);
		})
	}

	/** get current position */
	getCurrentPosition() {
		var env = this;
		this.geolocation.getCurrentPosition().then((resp) => {
			this.user.latitude = resp.coords.latitude;
			this.user.longitude = resp.coords.longitude;
			var lat = this.user.latitude;
			var lng = this.user.longitude;
			var latlng = new google.maps.LatLng(lat, lng);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let a = results[1].address_components;
					env.user.city = a[1].short_name;
					env.user.state = a[2].long_name;
					env.user.country = a[3].long_name;
					if (results[1]) {
					}
				}
			});

		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	loadMap() {
		let latLng = new google
		.maps
		.LatLng(this.user.latitude, this.user.longitude);

		let mapOptions = {
			center: latLng,
			zoom: 15,
			streetViewControl: false,
			disableDefaultUI: true

		}
		this.map = new google
		.maps
		.Map(this.mapElement.nativeElement, mapOptions);
		this.placeMarker(this.user.latitude, this.user.longitude);
		this.hideMap = true;
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
				if (results[1]) {
					const a = results[1].address_components;
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
			} else {

			}
		}
		);
	}

	/** edit profile */
	editProfile() {
		this.navCtrl.push("EditProfilePage", { profile_data: this.profile_data });
	}

	getProfile() {
		if (this.user.profile_image != null) {
			return this.api.IMAGE_URL + this.user.profile_image
		} else {
			return 'assets/imgs/profile.jpg';
		}
	}

	/** show map */
	showMap() {
		this.show_map = true;
		this.loadMap();
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
				env.hideMap = false;
				env.loadMap();
				env.placeMarker(latitude, longitude);
			}
		});
	}

	/** set search type */
	setSearchType() {
		if (this.user.search_type == '1') {
			this.show_buy_price = true;
			this.show_rent_price = false;
		} else {
			this.show_rent_price = true;
			this.show_buy_price = false;
		}
		let params = {
			search_type: this.user.search_type
		}
		this.commonUpdateAPI(params);
	}

	/** set property type */
	setPropertyType() {
		let params = {
			property_type: this.selectedType.join(',')
		}

		this.commonUpdateAPI(params);
	}

	setRentDuration() {
		let params = {
			rent_duration: this.user.rent_duration
		}
		this.commonUpdateAPI(params);
	}

	changeSearchRang() {
		this.setSearchRange(this.user)
	}

	setSearchRange(user) {
		let params = {
			search_range: user.search_range
		}
		this.commonUpdateAPI(params);
	}

	setBedrooms() {
		let params = {
			bedroom: this.user.bedroom
		}
		this.commonUpdateAPI(params);
	}

	setStudios() {
		let params = {
			studio: this.user.studio
		}
		this.commonUpdateAPI(params);
	}

	setBathrooms() {
		let params = {
			bathroom: this.user.bathroom
		}
		this.commonUpdateAPI(params);
	}

	setSqm() {
		let params = {
			sqm: this.user.sqm
		}
		this.commonUpdateAPI(params);
	}

	commonUpdateAPI(params) {
		this.api.put(params, 'api/users/' + localStorage.user_id).subscribe(data => {
		}, err => {
			console.log(err);
		});
	}

	/** set price range */
	setPriceRange() {
		if (this.show_buy_price) {
			let params = {
				min_price: parseInt(this.user.price_range),
				max_price: parseInt(this.user.price_range2)
			}
			this.commonUpdateAPI(params);
		} else {
			let params = {
				min_price: parseInt(this.user.price_range),
				max_price: parseInt(this.user.price_range2)
			}
			this.commonUpdateAPI(params);
		}
	}

	/** set attribute */
	setAttribute(attr, index) {
		const attrs = this.user.attribute;
		if (attr.checked) {
			const findIndex = attrs.findIndex(item => item.id === attr.id);
			this.user.attribute[findIndex].checked = false;
		} else {
			const findIndex = attrs.findIndex(item => item.id === attr.id);
			this.user.attribute[findIndex].checked = true;
		}
		const getChecked = attrs.filter(item => item.checked === true)
		.map(item => item.id);
		const params = {
			attributes: getChecked.join(',')
		};
		this.commonUpdateAPI(params);
	}

	/** set location */
	setLocation() {
		this.loader.presentLoading();
		let params = {
			// user_id: this.user.user_id,
			city: this.user.city,
			region: this.user.state,
			country: this.user.country,
			lat: this.user.latitude,
			lon: this.user.longitude,
		}
		this.api.put(params, 'api/users/' + localStorage.user_id).subscribe(data => {
			this.loader.dimissLoading();
			this.nativeStorage.clear();
			this.nativeStorage.setItem('user_data', { data: data.data })
			.then(
				() => console.log('Stored item!'),
				error => console.error('Error storing item', error)
				);
			this.navCtrl.setRoot(this.navCtrl.getActive().component);
			this.hideMap = true;
		}, err => {
			console.log(err);
			this.loader.dimissLoading();
			this.alert.showAlert('Error', 'Server Error');
		})
	}

	/** got to add neww property */
	addNewProperty() {
		this.navCtrl.push("AddPropertyPage");
	}

	/** hide upper section */
	hideUpperSection(data) {
		console.log(data);
		this.show_upper_section = false;
		this.selected_property = data;
	}

	/** go back to landlord section*/
	goToLandlord() {
		this.show_upper_section = true;
	}
	/** add appointment */

	addAppointment(property_id, reciever_id, chat_title) {
		this.navCtrl.push("AddAppointmentPage", { reciever_id: reciever_id, property_id: property_id, chat_title: chat_title, path: 'profile' });
	}
	/** chats */
	chat(id, title) {
		this.navCtrl.push("chat-view", { property_id: this.selected_property.id, id: id, title: title });
	}


	/** getMatchedProperties */
	showMatchedProperties() {
		this.show_back = true;
		if (this.show_manageRequest) {
			this.show_manageRequest = false;
		} else {
			this.show_manageRequest = true;
		}
	}

	hideBack() {
		this.show_back = false;
		if (this.show_manageRequest) {
			this.show_manageRequest = false;
		} else {
			this.show_manageRequest = true;
		}
	}
	viewPendingRequest() {
		this.show_upper_section = true;
		this.show_manageRequest = true;
	}
	getMatchedRequests() {
		this.total_requests = 0;
		this.api.get({ landlord_id: this.user.user_id }, 'api/requests').subscribe(data => {
			if (data.status === 200) {
				if (data.data.length != 0) {
					this.matched_requests = data.data;
					this.total_requests = 0;
					for (let a in this.matched_requests) {
						for (let b in this.matched_requests[a].requests) {
							if (this.matched_requests[a].requests) {
								this.total_requests = this.total_requests + 1;
							}
							console.log('b = ', b);
						}
					}
				}
			}
		}, err => {
			console.log(err);
		})
	}

	/** decline accept request */
	declineAcceptRequest(id, status, seeker_name) {
		this.loader.presentLoading();
		let params = {
			status: status
		}
		this.api.put(params, 'api/requests/' + id).subscribe(data => {
			this.loader.dimissLoading();
			if (data.status === 200) {
				this.getMatchedRequests();
			}
		}, err => {
			this.loader.dimissLoading();
			this.alert.showAlert("Error", "Server is not responding");
			console.log(err);
		})
	}
	/** go to settings */
	goToSettings() {
		this.navCtrl.push("SettingsPage");
	}

	acceptOrRejectAppointment(appointment: any, index: any, option: number) {
		let params = {
			appointment_id: appointment.appointment_id,
			message_id: appointment.id,
			request: option
		}
		this.user.callApi(params, 'appointment_accept_reject').subscribe(data => {
			if (data.status != 0) {
				this.selected_property.appointment_user[index].appointment_status = 2;
			}
		}, err => {
			console.log(err);
		})
	}

	checkType() {
		return (
			this.selectedType.indexOf('3') >= 0 ||
			this.selectedType.indexOf('6') >= 0 ||
			this.selectedType.indexOf('7') >= 0
			);
	}

	resetForm() {
		this.selectedType = [];
		this.user.search_type = "";
		this.user.search_range = 0.0;
		this.user.price_range = "";
		this.user.price_range2 = "";
		this.user.city = "";
		this.user.state = "";
		this.user.country = "";
		this.user.rent_duration = "";
		for (let a of this.user.attribute) {
			a.checked = false;
		}
		this.user.bedroom = -1;
		this.user.bathroom = -1;
		this.user.sqm = 0;
		this.getCurrentPosition();

		const attrs = this.user.attribute;
		const getChecked = attrs.filter(item => item.checked === true)
		.map(item => item.id);
		const params = {
			attributes: getChecked.join(','),
			property_type: this.selectedType.join(','),
			search_type: this.user.search_type,
			search_range: this.user.search_range,
			min_price: parseInt(this.user.price_range),
			max_price: parseInt(this.user.price_range2),
			city: this.user.city,
			region: this.user.state,
			country: this.user.country,
			lat: this.user.latitude,
			lon: this.user.longitude,
			rent_duration: this.user.rent_duration,
			bedroom: this.user.bedroom,
			bathroom: this.user.bathroom,
			sqm: this.user.sqm
		};
		this.commonUpdateAPI(params);
	}
}
