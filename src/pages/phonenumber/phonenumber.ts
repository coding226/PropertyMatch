import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the PhonenumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-phonenumber',
 	templateUrl: 'phonenumber.html',
 })
 export class PhonenumberPage {
 	mobile_number: number;
 	settings: boolean = false;
 	code: any;
 	callingcodes: any = [];

 	constructor(
 		translate: TranslateService,
 		public navCtrl: NavController,
 		public navParams: NavParams,
 		public api: ApiProvider,
 		public user: UserProvider,
 		public alert: AlertProvider,
 		public loader: LoaderProvider
 		) {
 		translate.setDefaultLang(localStorage.language);
 		if (this.navParams.get('path') == 'setting') {
 			this.settings = true;
 		}
 	}

 	ionViewDidLoad() { }

 	ionViewWillEnter() {
 		this.user.hideTabs = true;
 	}
 	ionViewDidEnter() {
 		this.user.getCallingCodes().subscribe(r => {
 			const sorted = _.sortBy(r, 'name');
 			this.callingcodes = sorted;
 		});
 	}
 	ionViewWillLeave() {
 		// this.user.hideTabs = false;
 	}
 	/**  add mobile number*/
 	continue() {
 		let codedata = this.code.split(',');

 		this.loader.presentLoading();
 		var params = {};
 		if (this.navParams.get('path') == 'setting') {
 			params = {
 				user_id: this.user.user_id,
 				mobile: codedata[0].replace('+', '') + this.mobile_number,
 			};
 		} else {
 			params = {
 				mobile: codedata[0].replace('+', '') + this.mobile_number,
 			};
 		}
 		this.api.put(params, 'api/users/' + this.user.user_id + '/mobile').subscribe(
 			data => {
 				this.loader.dimissLoading();
 				if (data.status === 200) {
 					this.navCtrl.setRoot('VerificationNumberPage', { id: this.user.user_id });
 				} else {
 					this.alert.showAlert('Error', data.message);
 				}
 			},
 			err => {
 				this.loader.dimissLoading();
 				this.alert.showAlert('Error', err);
 			}
		);
 	}
 }
