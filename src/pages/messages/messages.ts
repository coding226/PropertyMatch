import { Component, NgZone } from '@angular/core';
import { IonicPage, Events, NavController, NavParams, AlertController } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-messages',
	templateUrl: 'messages.html',
})
export class MessagesPage {
	user_mode: string = 'seeker';
	seeker_matches: string = 'new';
	landlord_matches: string = 'new';
	new_matches_seeker: any = [];
	matched_requests_landlord: any = [];
	seeker_message_list: any = [];
	landlord_message_list: any = [];
	newMessageLandlord: number = 0;
	newMessageSeeker: number = 0;
	newMessageSeekerArray: any = [];
	newMessageLandlordArray: any = [];
	newMessageSeekerObj: any = {};
	newMessageLandlordObj: any = {};
	constructor(
		public events: Events,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		private _ngZone: NgZone,
		public navParams: NavParams,
		public api: ApiProvider,
		public user: UserProvider,
		public alert: AlertProvider,
		translate: TranslateService,
		public loader: LoaderProvider
		) {
		translate.setDefaultLang(localStorage.language);
	}

	ionViewDidLoad() {
	}

	ionViewWillEnter() {
		this._loadingData();
	}

	private _loadingData() {
		this.newMessageLandlord = 0;
		this.newMessageSeeker = 0;
		this.getNewMatchesForSeeker();
		this.getSeekerMessageList();
		this.getLandlordMessageList();
		this.getMatchedRequestsForLandlord();
		this.getNewMessage();
		this.events.publish('NEWMESSAGE');
	}

	private _apiDeleteMessage(id) {
		this.api.delete('api/chatthreads/' + id).subscribe(data => {
			if (data.status) {
				this._loadingData();
			}
		}, err => {
			this.alert.showAlert("Error", "Server is not responding");
		})
	}

	deleteMessage(list) {
		const confirm = this.alertCtrl.create({
			title: 'Confirm to delete ?',
			message: 'Confirm to delete this message.',
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
					this._apiDeleteMessage(list.thread_id);
					console.log('Agree clicked');
				}
			}
			]
		});

		confirm.present();
	}

	getNewMessage() {
		let params = {
			user_id: this.user.user_id,
		}
		this.api.get(params, 'api/chats/unread').subscribe(data => {
			if (data.status === 200) {
				if (data.data.length > 0) {
					data.data.forEach((message) => {
						if (message.chat_thread.sender_id === Number(this.user.user_id)) {
							this.newMessageSeeker++;
							if (!!this.newMessageLandlordObj[message.thread_id]) {
								this.newMessageSeekerObj[message.thread_id] += 1;
							} else {
								this.newMessageSeekerObj[message.thread_id] = 1;
							}
						} else {
							this.newMessageLandlord++;
							if (!!this.newMessageLandlordObj[message.thread_id]) {
								this.newMessageLandlordObj[message.thread_id] += 1;
							} else {
								this.newMessageLandlordObj[message.thread_id] = 1;
							}
						}
					});
				} else {
					this.newMessageSeekerObj = {};
					this.newMessageLandlordObj = {};
				}
			} else {
			}
		});
	}

	getNewMatchesForSeeker() {
		this.user_mode = "seeker";
		this.api.get({}, 'api/requests/landlord-matched/' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				if (data.data) {
					this._ngZone.run(() => {
						this.new_matches_seeker = data.data;
					});
				}
			} else {
			}
		}, err => {
			this.alert.showAlert("Error", "Server is not responding");
		})
	}

	/** landlord requests from seeker */
	getMatchedRequestsForLandlord() {
		this.user_mode = "landlord";
		this.api.get({}, 'api/requests/seeker-matched/' + this.user.user_id).subscribe(data => {

			if (data.status === 200) {
				if (data.data) {
					this.matched_requests_landlord = data.data;
				} else {
					this.matched_requests_landlord = [];
				}

			} else {
				// this.alert.showAlert("Message", "No requests for landlord");
			}
		}, err => {
			// console.log(err);
		})
	}

	/** go first tab */
	goFirstTab(data: any) {
		this.navCtrl.push("ProfilePage", { rootFrom: 'message', data: data });
	}

	openChat(request) {
		const params = {
			request_id: request.id,
			property_id: request.property_id,
			sender_id: request.property.user_id,
			receiver_id: request.user_id,
		};
		this.api.post(params, 'api/chatthreads').subscribe(data => {
			if (data.status === 200) {
				this.navCtrl.push("chat-view", {
					property_id: request.property_id,
					id: data.data.thread_id,
					title: request.property.title
				});
			}
		});
	}

	/** chats */
	chat(property_id, id, title) {
		this.navCtrl.push("chat-view", { property_id: property_id, id: id, title: title });
	}
	/** send message */
	getSeekerMessageList() {
		this.user_mode = "seeker";
		this.api.get({}, 'api/chatthreads/sender/' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				this.seeker_message_list = [...data.data];
			} else {
				this.seeker_message_list = [];
			}
		}, err => {
		})
	}

	/** send message */
	getLandlordMessageList() {
		this.user_mode = "landlord";
		this.api.get({}, 'api/chatthreads/receiver/' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				this.landlord_message_list = [...data.data];
			} else {
				this.landlord_message_list = [];
			}
		}, err => {
		})
	}

	/** go to settings */
	goToSettings() {
		this.navCtrl.push("SettingsPage");
	}
}
