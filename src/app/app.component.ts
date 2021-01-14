import { Component } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';

import { TabsPage } from '../pages/tabs/tabs';

import { UserProvider } from '../providers/user/user';
import { AlertProvider } from '../providers/alert/alert';
import { LoaderProvider } from '../providers/loader/loader';
import { ApiProvider } from '../providers/api/api';
import { ViewChild } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { TranslateService } from '@ngx-translate/core';
import { LineLogin } from '@ionic-native/line-login';

declare var google;
@Component({
	template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
	@ViewChild('MyApp') nav: Nav;
	rootPage: any;
	deviceToken;
	constructor(public translate: TranslateService, public events: Events, private fcm: FCM, private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public geolocation: Geolocation, public nativeStorage: NativeStorage, public user: UserProvider, public api: ApiProvider, public alert: AlertProvider, public loader: LoaderProvider,  private line: LineLogin) {
		platform.ready().then(async () => {
			statusBar.styleDefault();
			splashScreen.hide();
			await this.proeprtyType();
			await this.getAttributes();
			await this.setRootPage();

			this.loader.readDevicestate();
			this.platform.pause.subscribe(() => {
			});
			this.platform.resume.subscribe(() => {
				this.handleNoti();
			});
			this.handleNoti();
			this.line.initialize({ channel_id: "1655548955" });
		});
	}

	ngOnInit() {
		// TODO set default translate language
		if(!localStorage.language){
			localStorage.setItem("language", "en");
		}
		this.translate.setDefaultLang(localStorage.language);
	}

	handleNoti() {
		this.fcm.getToken().then(token => {
			this.deviceToken = token || 'sdfwoeh33s3531w';
			this.user.device_token = token;
		});

		this.fcm.onNotification().subscribe(data => {
			const noti = JSON.parse(JSON.stringify(data));
			const notiData = JSON.parse(noti.data);
			if (data.wasTapped) {
				this.events.publish('notification clicked', 2);
			} else {
				if (parseInt(notiData.receiver_id) === parseInt(this.user.user_id + '')) {
					this.events.publish('NEWMESSAGE');
					this.events.publish("MESSAGE:RECIEVED", data);
				}
			};
		});
	}

	async setRootPage() {
		if (localStorage.user_id) {
			await this.api.get(
				{
				},
				'api/users/' + localStorage.user_id).subscribe(data => {
					if(!!data.data) {
						this.user.user_id = data.data.id;
						this.user.email = data.data.email; // dob
						this.user.name = data.data.name;
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
						this.user.inappsound = data.data.inappsound;

						this.user.bedroom = data.data.bedroom
						this.user.bathroom = data.data.bathroom
						this.user.studio = data.data.studio
						this.user.sqm = data.data.sqm
						this.user.rent_duration = data.data.rent_duration
						this.user.property_type = data.data.property_type
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

						if (!!!data.data.mobile) {
							this.rootPage = "PhonenumberPage";
						} else if (data.data.is_verified == 0) {
							this.rootPage = "VerificationNumberPage";
						} else {
							this.rootPage = TabsPage;
						}
					} else {
						this.rootPage = "ChooseLanguagePage";
					}
				});
		} else {
			this.rootPage = "ChooseLanguagePage";
		}
	}

	/** get attribute */
	getAttributes() {
		const env = this;
		return new Promise(function (resolve, reject) {
			env.api.get({}, 'api/propertyattributes').subscribe(res => {
				// alert(JSON.stringify(res));
				env.user.attribute = res.data;
				env.user.attribute.map(x => {
					x.checked = false;
				})
				resolve(true);
			}, err => {
				alert(JSON.stringify(err));
			})
		});
	}

	/** get property type */
	proeprtyType() {
		const env = this;
		return new Promise(function (resolve, reject) {
			env.api.get({}, 'api/propertytypes').subscribe(res => {
				// alert(JSON.stringify(res));
				env.user.property_type_array = res.data;
				resolve(true);
			}, err => {
				alert(JSON.stringify(err));
			})
		});
	}


	/** get current position */
	getCurrentPosition() {
		var env = this;
		this.geolocation.getCurrentPosition().then((resp) => {
			// console.log("getCurrentPosition", resp);
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
					}
					// env.setRootPage();
				}
				//env.setRootPage();
			});
			//  this.setRootPage();
		}).catch((error) => {
		});
	}
}
