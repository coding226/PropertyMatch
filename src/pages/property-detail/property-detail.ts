import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
	selector: 'page-property-detail',
	templateUrl: 'property-detail.html',
	providers: [
		SocialSharing
	]
})
export class PropertyDetailPage {
	_imageViewerCtrl: ImageViewerController;
	myImage
	detail: any;
	attributes: any = [];
	main_images: any = [];
	additional_images: any = [];
	imageUrl: string = "";
	from: string = "";
	likedProperty: boolean = false;
	likedPropertyRequestId: any;

	constructor(
		translate: TranslateService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public api: ApiProvider,
		public user: UserProvider,
		public alert: AlertProvider,
		public alertCtrl: AlertController,
		public loader: LoaderProvider,
		public viewCtrl: ViewController,
		public imageViewerCtrl: ImageViewerController,
		private socialSharing: SocialSharing
		) {
		translate.setDefaultLang(localStorage.language);
		this._imageViewerCtrl = imageViewerCtrl;
		this.imageUrl = this.api.IMAGE_URL;
		this.detail = this.navParams.get('detail');
		let attributes = this.detail.attributes.split(',');
		this.main_images = this.detail.images.filter(item => item.image_type === '1');
		this.additional_images = this.detail.images.filter(item => item.image_type === '0');
		for (let x in this.user.attribute) {
			for (let y in attributes) {
				if (this.user.attribute[x].id == attributes[y]) {
					this.attributes.push({ id: this.user.attribute[x].id, title: this.user.attribute[x].title, title_th: this.user.attribute[x].title_th })
				}
			}
		}
		console.log(this.attributes);
		this.from = this.navParams.get('from');
		this.likedProperty = this.navParams.get('likedProperty');
		this.likedPropertyRequestId = this.navParams.get('likedPropertyRequestId');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PropertyDetailPage');
	}
	/** close  */
	close() {
		this.navCtrl.pop();
	}

	/** make request */
	makeRequest(status) {
		this.loader.presentLoading();
		let params = {
			user_id: this.user.user_id,
			request: status,
			property_id: this.detail.id
		}
		this.api.post(params, 'api/requests').subscribe(data => {
			this.loader.dimissLoading();
			if (data.status === 200) {
				this.closeModal((status === 0) ? 'accept' : 'cancel')
			} else {
				this.alert.showAlert("Error", data.error);
			}
		}, err => {
			this.loader.dimissLoading();
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	/** make request */
	deleteRequest(request_id) {
		this.loader.presentLoading();
		this.api.delete('api/requests/' + request_id).subscribe(data => {
			this.loader.dimissLoading();
			if (data.status === 200) {
				this.navCtrl.pop();
			} else {
				this.alert.showAlert("Error", data.error);
			}
		}, err => {
			this.loader.dimissLoading();
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	closeModal(option: string) {
		let data = { 'option': option };
		this.viewCtrl.dismiss(data);
	}

	showConfirm(propertyId) {
		const alert = this.alertCtrl.create({
			title: 'Report Property',
			subTitle: 'Is this property bothering you? Tell us more about it',
			inputs: [
				{
          name: 'report',
          type: 'radio',
          label: 'Inappropriate Photos',
          value: 'Inappropriate Photos',
          checked: true
        },
				{
          name: 'report',
          type: 'radio',
          label: 'Spam',
          value: 'Spam'
        },
				{
          name: 'report',
          type: 'radio',
          label: 'Other',
          value: 'Other'
        }
			],
			buttons: [
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			},
			{
				text: 'Report',
				handler: (alertData) => {
					this.reportProperty(propertyId, alertData);
				}
			}
			]
		});
		alert.present();
	}

	reportProperty(propertyId, message) {
		this.loader.presentLoading();
		const params = {
			request_id: 1,
			property_id: propertyId,
			sender_id: this.user.user_id,
			receiver_id: 165,
		};
		this.api.post(params, 'api/chatthreads').subscribe(data => {
			if (data.status === 200) {
				let params = {
					user_id: Number(this.user.user_id),
					thread_id: data.data.thread_id,
					message: message,
					property_id: propertyId
				}
				this.api.post(params, 'api/chats').subscribe(data => {
					if (data.status === 200) {
						this.loader.dimissLoading();
					}
				}, err => {
					this.loader.dimissLoading();
					this.alert.showAlert("Error", 'Server not responding');
				})
			}
		}, err => {
			this.loader.dimissLoading();
			this.alert.showAlert("Error", 'Server not responding');
		});
	}

	getPropertyString(propertyId: any) {
		let prpertyTypes = this.user.property_type_array;
		let propertyTypeData = prpertyTypes.filter((arr) => {
			return arr.id == propertyId
		})[0];
		return propertyTypeData.title
	}

	getPropertyFor(propertyFor: any) {
		if (propertyFor == 1) {
			return "Sale"
		} else if (propertyFor == 0) {
			return "Rent"
		} else {
			return "Both"
		}
	}

	acceptRejectProperty(userId, propertyId, type) {
		let params = {
			user_id: userId,
			property_id: propertyId,
			request: type
		}
		this.user.callApi(params, 'property_accept_reject').subscribe(data => {
			console.log(data);
			this.closeModal('accept')

		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	setCenter($event) {
		console.log($event)
	}

	presentImage(myImage, $event) {
		const imageViewer = this._imageViewerCtrl.create($event.target);
		imageViewer.present();
		imageViewer.onDidDismiss(() => {

		});
	}

	printPrice(p) {
		if (p.property_for === '0') {
			return this.numberWithCommas(p.rent_cost);
		} else if (p.property_for === '1') {
			return this.numberWithCommas(p.buy_cost);
		} else {
			return this.numberWithCommas(p.buy_cost);
		}
	}

	numberWithCommas(x) {
		if(!!x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return 0.0;
	}

	openChat() {
		const params = {
			request_id: 1,
			property_id: this.detail.id,
			sender_id: this.user.user_id,
			receiver_id: this.detail.user_id,
		};
		this.api.post(params, 'api/chatthreads').subscribe(data => {
			if (data.status === 200) {
				this.navCtrl.push("chat-view", {
					property_id: this.detail.id,
					id: data.data.thread_id,
					title: this.detail.title
				});
			}
		});
	}

	shareProperty(p) {
		let urlToStore = "https://play.google.com/store/apps/details?id=com.moonoi.propertymatchnew";
		let mainImageUrl = (this.main_images.length > 0) ? this.api.IMAGE_URL + this.main_images[0].image_path : "";

		const alert = this.alertCtrl.create({
			title: 'Please select from below',
			subTitle: '',
			inputs: [],
			buttons: [
				{
					text: 'Share via Facebook',
					handler: () => {
						this.socialSharing.shareViaFacebook(p.title, mainImageUrl, urlToStore);
					}
				},
				{
					text: 'Share via Twitter',
					handler: () => {
						this.socialSharing.shareViaTwitter(p.title, mainImageUrl, urlToStore);
					}
				},
				{
					text: 'Share via Instagram',
					handler: () => {
						this.socialSharing.shareViaInstagram(p.title, mainImageUrl);
					}
				},
				{
					text: 'Share via WhatsApp',
					handler: () => {
						this.socialSharing.shareViaWhatsApp(p.title, mainImageUrl, urlToStore);
					}
				},
				{
					text: 'Share via SMS',
					handler: () => {
						this.socialSharing.shareViaSMS(p.description + "\n" + mainImageUrl + "\n" + urlToStore, "");
					}
				},
				{
					text: 'Share via Email',
					handler: () => {
						this.socialSharing.shareViaEmail(p.description + "\n" + mainImageUrl + "\n" + urlToStore, p.title, []);
					}
				},
				{
					text: 'Share via Line App',
					handler: () => {
						this.socialSharing.shareVia('line', p.description +"\n" + mainImageUrl +"\n" + urlToStore);
					}
				}
			]
		});
		alert.present();
	}

	get currentLanguage() {
		return localStorage.language;
	}
}
