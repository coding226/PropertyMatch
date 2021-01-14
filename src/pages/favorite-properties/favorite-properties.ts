import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the FavoritePropertiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: "FavoritePropertiesPage"
})

@Component({
  selector: 'page-favorite-properties',
  templateUrl: 'favorite-properties.html',
})

export class FavoritePropertiesPage {
	properties: any = [];
	cards: any = [];
	imageUrl: string = "";
	pageNo: number = 1;
	showInfo: boolean = false;

	constructor(
		translate: TranslateService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public api: ApiProvider,
		public user: UserProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider,
		public modalCtrl: ModalController
	) {
		translate.setDefaultLang(localStorage.language);
	}

	currentLang: String;

	ionViewWillEnter() {
		this.user.hideTabs = true;
		this.currentLang = localStorage.language;
		this.getProperties();
	}

	ionViewWillLeave() {
		this.user.hideTabs = false;
	}

	ionViewDidLoad() {

	}

  /** get properties */
	getProperties(reset = 0) {
		this.showInfo = false;
		let params = {
			// user_id: this.user.user_id,
			page: this.pageNo,
			reset: reset,
		};
		this.api.get(params, 'api/requests/get-liked-properties?landlord_id=' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				if (data.data.length > 0) {
					this.properties = [...data.data.reverse()];
					const hasIds = this.cards.map(item => item.id);
					const list = [];
					for (let i = 0; i < this.properties.length; i++) {
						if (hasIds.indexOf(this.properties[i].property_id) < 0 && this.properties[i].property != null) {
							list.push({
								image_path: (this.properties[i].property.images.length > 0 && this.properties[i].property.images[0].image_path) ? this.properties[i].property.images[0].image_path : "",
								title: this.properties[i].property.title,
								address: this.properties[i].property.address,
								id: this.properties[i].property.id,
								user_id: this.properties[i].user_id,
								alldata: this.properties[i].property,
                request_id: this.properties[i].id
							})
						}
					}
					this.cards = this.cards.concat(list);
          this.showInfo = true;
				} else {
					this.cards = [];
					this.showInfo = true;
				}
				// this.cards=data.data;
			} else {
				this.cards = [];
				this.showInfo = true;
				// this.errormsg = data.error + 'Please change your search settings in profile.';
				// this.alert.showAlert("Error", 'Please change your search settings in profile.');
			}
		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

  /** go to property detail */
	propertyDetail(detail: any, request_id) {
		const modal = this.modalCtrl.create("PropertyDetailPage", { detail: detail, likedProperty: true, likedPropertyRequestId: request_id });
		modal.onDidDismiss((data) => {
			if (data) {
				if (data.option == 'cancel') {
					// this.voteUp(false, detail.id)
					this.cards.pop();
				}
				if (data.option == 'accept') {
					this.cards.pop();
				}
			}
      this.getProperties();
		});
		modal.present();
	}

}
