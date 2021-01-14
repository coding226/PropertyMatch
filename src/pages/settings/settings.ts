import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})

export class SettingsPage {
	constructor(
		translate: TranslateService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public user: UserProvider,
		public nativeStorage: NativeStorage,
		public alert: AlertProvider,
		public app: App
	) {
		translate.setDefaultLang(localStorage.language);
	}

	currentLang:String;

	ionViewWillEnter() {
		this.user.hideTabs = true;
		this.currentLang = localStorage.language;
	}

	ionViewWillLeave() {
		this.user.hideTabs = false;
	}

	/** sign out */
	signOut() {
		const languageRecord = localStorage.language;
		localStorage.clear();
		this.nativeStorage.clear();
		this.alert.showAlert("Message", "Sign out successfully.");
		// this.navCtrl.setRoot("GetstartedPage");
		localStorage.setItem("language", languageRecord);
		this.app.getRootNav().setRoot("GetstartedPage");
		this.updateDevicetoken();
	}

	updateDevicetoken() {
		this.user.callApi({ user_id: this.user.user_id }, 'remove_device_token').subscribe(data => {
		}, err => {
			console.log(err);
		})
	}
	/** in app purchase of boost likes */
	purchaseBoostLikes() {
		// this.iap
		//   .getProducts(['com.ameba.propertymatch'])
		//   .then((products) => {
		//     console.log(products);
		//       //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
		//   })
		//   .catch((err) => {
		//     console.log(err);
		//   });

		// this.iap
		// 	.buy('com.ameba.propertymatch')
		// 	.then((data) => {
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		this.alert.showAlert("Error", err.message);
		// 	});
	}

	notificationSetting() {
		this.navCtrl.push("NotificationSettingsPage");
	}
	personalSetting() {
		this.navCtrl.push("EditProfilePage");
	}
	phoneNumberSetting() {
		this.navCtrl.push("PhonenumberPage", { path: 'setting' });
	}
	LanguageSetting(){
		this.navCtrl.push("ChooseLanguagePage", { path: 'setting' });
	}
	favoritePropertiesSetting(){
		this.navCtrl.push("FavoritePropertiesPage", { path: 'setting' });
	}
}
