import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { NativeStorage } from "@ionic-native/native-storage";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { Geolocation } from "@ionic-native/geolocation";
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from "./../../providers/user/user";
import { AlertProvider } from "./../../providers/alert/alert";
import { LoaderProvider } from "./../../providers/loader/loader";
import { TabsPage } from "../../pages/tabs/tabs";
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from "@ngx-translate/core";

declare var google;

@IonicPage()

@Component({
	selector: "page-login",
	templateUrl: "login.html"
})

export class LoginPage {
	loginForm: FormGroup;
	deviceToken: any;
	platformType: string;
	facebookName: string;
	passwordType: string = 'password';
  	passwordIcon: string = 'eye-off';
	constructor(
		public navCtrl: NavController,
		public geolocation: Geolocation,
		public navParams: NavParams,
		private fb: Facebook,
		// private googlePlus: GooglePlus,
		private nativeStorage: NativeStorage,
		public user: UserProvider,
		public api: ApiProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider,
		private fcm: FCM,
		translate: TranslateService,
		public pltform: Platform
	) {
		translate.setDefaultLang(localStorage.language);
		this.loginForm = new FormGroup({
			email: new FormControl("", [Validators.required, Validators.email]),
			password: new FormControl("", [Validators.required])
		});
		this.fcm.getToken().then(token => {
			this.deviceToken = token;
		});
		if (this.pltform.is('android')) {
			this.platformType = 'android';
		} else if (this.pltform.is('ios')) {
			this.platformType = 'ios';
		}
	}

	/** got tosignup */
	signup() {
		this.navCtrl.setRoot("GetstartedPage");
	}
	/** do signup */
	doLogin() {
		if(this.loginForm.valid) {
			this.loader.presentLoading();
			let params = {
				password: this.loginForm.value.password,
				email: this.loginForm.value.email,
				//	device_token:this.user.device_id,
				device_token: this.deviceToken || 'sdf123123',
				device_type: this.platformType || 'android'
			};
			this.api.post(params, "api/auth/login").subscribe(
				data => {
					this.loader.dimissLoading();
					if (data.status === 404) {
						this.alert.showAlert("Error", "You are not verified!");
						this.navCtrl.setRoot("VerificationNumberPage", {
							id: data.data.id
						});
					} else if (data.status === 200) {
						this.user.user_id = data.data.id;
						this.user.name = data.data.name;
						this.user.email = data.data.email;
						this.user.short_description = data.data.description;
						this.user.status = data.data.status;
						this.user.gender = data.data.gender;
						this.user.occupation = data.data.occupation;
						this.user.age = data.data.age;
						this.user.profile_image = data.data.profile_image;
						this.user.email_verified = data.data.email_verified;
						this.user.newmatches = data.data.newmatches;
						this.user.messages = data.data.messages;
						this.user.inappvibrations = data.data.inappvibrations;
						this.user.inappsound = data.data.inappsound

						if (data.data.city != null) {
							this.user.city = data.data.city;
						}
						if (data.data.region != null) {
							this.user.state = data.data.region;
						}
						if (data.data.country != null) {
							this.user.country = data.data.country;
						}
						if (data.data.lat != null && data.data.lon != null) {
							this.user.latitude = data.data.lat;
							this.user.longitude = data.data.lon;
						} else {
							this.getCurrentPosition();
						}

						localStorage.setItem('user_id', data.data.id + '');
						this.navCtrl.setRoot(TabsPage);
					}
				},
				err => {
					this.loader.dimissLoading();
					this.alert.showAlert("Error", "Server not responding");
				}
			);
		} else {
			this.alert.showAlert("Error", "Please check your credentials");
		}

	}

	/** facebook login */
	doFacebookLogin() {
		var env = this;
		this.fb
			.login(["public_profile", "email"])
			.then((res: FacebookLoginResponse) => {
				env.fb
					.api("/me?fields=id,first_name,last_name,gender,email", [])
					.then(function (user) {
						env.loader.presentLoading();
						let params = {
							name: user.first_name + ' ' + user.last_name,
							email: user.email,
							//	device_token:this.user.device_id,
							device_token: env.deviceToken || 'sdf123123',
							device_type: "android",
							facebook_id: user.id,
						};
						env.user.callApi(params, "api/auth/login/social").subscribe(
							data => {
								if (data.status != 0) {
									localStorage.setItem('user_id', data.data.id + '');
									env.nativeStorage
										.setItem("user_data", { data: data.data })
										.then(
											() => console.log("Stored item!"),
											error => console.error("Error storing item", error)
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
									env.loader.dimissLoading();
									if(data.data.mobile == null) {
										env.navCtrl.push("PhonenumberPage", {
											id: env.user.user_id
										});
									} else if (data.new == 'new') {
										env.navCtrl.setRoot('VerificationNumberPage', {
											id: data.data.id,
											mobile: data.data.mobile,
											userdata: data.data,
										});
									} else {
										env.navCtrl.setRoot(TabsPage);
									}
								} else {
									env.loader.dimissLoading();
									env.alert.showAlert("Message", data.message);
									env.navCtrl.setRoot("PhonenumberPage", { id: data.data.id });
								}
							},
							err => {
								env.loader.dimissLoading();
								console.log(err);
							}
						);
					});
			})
			.catch(e => console.log("Error logging into Facebook", e));
	}

	/** do google login */
	doGoogleLogin() {
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
				}
			});
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	goToForgetPassword() {
		this.navCtrl.push("forget-password");
	}

	hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
