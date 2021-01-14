import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
// import { GooglePlus } from '@ionic-native/google-plus';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TabsPage } from '../../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { LineLogin, LineLoginProfile } from '@ionic-native/line-login';

declare var google;

@IonicPage()
@Component({
	selector: 'page-getstarted',
	templateUrl: 'getstarted.html',
})
export class GetstartedPage {
	deviceToken: any;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private nativeStorage: NativeStorage,
		public geolocation: Geolocation,
		private line: LineLogin,
		private fb: Facebook,
		// private googlePlus: GooglePlus,
		public api: ApiProvider,
		public user: UserProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider,
		translate: TranslateService
		) {
		translate.setDefaultLang(localStorage.language);
	}

	ionViewWillEnter() {
		this.user.hideTabs = true;
	}
	/** go to login page */
	login() {
		this.navCtrl.setRoot("LoginPage");
	}

	/** got tosignup */
	signup() {
		this.navCtrl.setRoot("SignupPage");
	}
	/** line login */
	doLineLogin() {
		var env = this;
		console.log("login started")
		this.line.login()
			.then((res: LineLoginProfile) => {
				console.log("Line logged in!", res);
				localStorage.setItem('user_id', res.userID);
				env.nativeStorage.setItem('user_data', { data: res })
					.then(
						() => console.log('Stored item!'),
						error => console.error('Error storing item', error)
					);
				env.user.name = res.displayName;
				env.user.profile_image = res.pictureURL;
				env.getCurrentPosition();
				env.navCtrl.setRoot(TabsPage);
			})
			.catch(e => console.log('Error logging into Facebook', e));
	}
	/** facebook login */
	doFacebookLogin() {
		var env = this;
		this.fb.login(['public_profile', 'email'])
		.then((res: FacebookLoginResponse) => {
			env.fb
			.api("/me?fields=id,first_name,last_name,gender,email", [])
			.then(function (user) {
				env.loader.presentLoading();
				if(!!!user.email) {
					user.email = 'facebook' + Math.floor(Math.random() * 10000 + 10000) + '@fb.com';
				}
				let params = {
					name: user.first_name + ' ' + user.last_name,
					email: user.email,
					facebook_id: user.id,
					device_token: env.user.device_token,
					device_type: 'android',
				}
				env.user.callApi(params, "api/auth/login/social").subscribe(data => {
					env.loader.dimissLoading();
					if (data.status != 0) {
						localStorage.setItem('user_id', data.data.id+'');
						env.nativeStorage.setItem('user_data', { data: data.data })
						.then(
							() => console.log('Stored item!'),
							error => console.error('Error storing item', error)
							);
						env.user.user_id = data.data.id;
						env.user.name = data.data.name;
						env.user.short_description = data.data.description;
						env.user.status = data.data.status;
						env.user.gender = data.data.gender;
						env.user.occupation = data.data.occupation;
						env.user.age = data.data.age;
						env.user.profile_image = data.data.profile_image;
						if (data.data.city != null) {
							env.user.city = data.data.city;
						}
						if (data.data.region != null) {
							env.user.state = data.data.region;
						}
						if (data.data.country != null) {
							env.user.country = data.data.country;
						}
						if (data.data.lat != null && data.data.lon != null) {
							env.user.latitude = data.data.lat;
							env.user.longitude = data.data.lon;
						} else {
							env.getCurrentPosition();
						}
						// env.alert.showAlert('Message', data.message);
						if(data.data.mobile == null) {
							env.navCtrl.push("PhonenumberPage", {
								id: env.user.user_id
							});
						} else if (data.new) {
							env.navCtrl.setRoot('VerificationNumberPage', {
								id: data.data.id,
								mobile: data.data.mobile,
								userdata: data.data,
							});
						} else {
							env.navCtrl.setRoot(TabsPage);
						}
					} else {
						alert(JSON.stringify(data));
						env.alert.showAlert('Message', data.message);
						// env.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });

					}
				}, err => {
					alert(JSON.stringify(err));
					env.loader.dimissLoading();
				})
			})
		})
		.catch(e => console.log('Error logging into Facebook', e));
	}

	/** do google login */
	doGoogleLogin() {;
	}

	/** get current position */
	getCurrentPosition() {
		var env = this;
		this.geolocation.getCurrentPosition().then((resp) => {
			console.log("getCurrentPosition", resp);
			this.user.latitude = resp.coords.latitude;
			this.user.longitude = resp.coords.longitude;

			var lat = this.user.latitude;
			var lng = this.user.longitude;
			var latlng = new google.maps.LatLng(lat, lng);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let a = results[1].address_components;
					console.log(a);
					env.user.city = a[1].short_name;
					env.user.state = a[2].long_name;
					env.user.country = a[3].long_name;
					if (results[1]) {
						console.log(results[1]);
						console.log("Location: " + results[1].formatted_address);
					}
					// env.setRootPage();
				}
				//env.setRootPage();
			});
			//  this.setRootPage();
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	phoneNumberSetting() {
		this.navCtrl.push("PhonenumberPage", {
			id: this.user.user_id
		});
	}
}
