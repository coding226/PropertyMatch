import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Events, Content, ModalController, ActionSheetController } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';

@IonicPage({
	name: 'chat-view'
})
@Component({
	selector: 'page-chat-view',
	templateUrl: 'chat-view.html',
})
export class ChatViewPage {
	@ViewChild(Content) content: Content;
	id: string;
	message: string;
	reciever_id: number;
	chat_title: number;
	chat: any = [];
	chatDuration: any;
	property_id: any;

	constructor(
		translate: TranslateService,
		public navCtrl: NavController,
		private platform: Platform,
		private _ngZone: NgZone,
		public navParams: NavParams, public events: Events, public user: UserProvider,
		public api: ApiProvider, public alert: AlertProvider, public loader: LoaderProvider,
		public modalCtrl: ModalController,
		public actionSheetCtrl: ActionSheetController,
		public imagePicker: ImagePicker,
		private camera: Camera,
	) {
		translate.setDefaultLang(localStorage.language);
	}

	ionViewDidLoad() {
		this.platform.resume.subscribe(() => {
			this.readMessages();
			this.getChatMessages();
		});
	}

	ionViewWillEnter() {
		this.chat_title = this.navParams.get('title');
		this.id = this.navParams.get('id');
		this.property_id = this.navParams.get('property_id');
		this.events.subscribe('MESSAGE:RECIEVED', (notificationData: any) => {
			let data = JSON.parse(notificationData.data);
			if (this.property_id == data.property_id) {
				this._ngZone.run(() => {
					this.chat.push(data);
				});
			}
		});
		this.user.hideTabs = true;
		this.readMessages();
		this.getChatMessages();
	}

	ionViewWillLeave() {
		this.user.hideTabs = false;
		this.events.unsubscribe('MESSAGE:RECIEVED');
	}

	readMessages() {
		let params = {
			thread_id: this.id,
			user_id: this.user.user_id,
		}

		this.api.put(params, 'api/chats/read' ).subscribe(data => {
			if (data.status === 200) {
			}
		}, err => {
		})
	}

	/** get chat messages */
	getChatMessages() {
		this.api.get({}, 'api/chats/' + this.id).subscribe(data => {
			if (data.status === 200) {
				this.getNewMessage();
				this.chat = data.data;
				setTimeout(() => {
					this.scroll();
				}, 200);
			}
		}, err => {
			console.log(err);
		})
	}

	getNewMessage() {
		this.events.publish('NEWMESSAGE');
	}

	/** send message */
	sendMessage() {
		if (this.message != undefined && this.message != '') {
			let params = {
				user_id: Number(this.user.user_id),
				thread_id: this.id,
				message: this.message,
				property_id: this.property_id
			}
			this.message = '';
			this.api.post(params, 'api/chats').subscribe(data => {
				if (data.status === 200) {
					this.chat.push(data.data);
					setTimeout(() => {
						this.scroll();
					}, 200);
				}
			}, err => {
				console.log(err);
			})
		}
	}

	scroll() {
		if (this.content) {
			this.content.scrollToBottom();
		}
	}
	
	getChatDate(date) {
		return new Date(date);
	}

	isMe(msg) {
		return	(msg.user_id === Number(this.user.user_id));
	}

	uploadImage() {
		let actionSheet = this
			.actionSheetCtrl
			.create({
				title: 'Select Image Source',
				buttons: [
					{
						text: 'Load from Library',
						handler: () => {
							this.pickImageFromibrary();
						}
					}, {
						text: 'Use Camera',
						handler: () => {
							this.takePicture(this.camera.PictureSourceType.CAMERA);
						}
					}, {
						text: 'Cancel',
						role: 'cancel'
					}
				]
			});
		actionSheet.present();
	}

	pickImageFromibrary() {
		let options = {
			maximumImagesCount: 1,
			quality: 50
		}
		this.imagePicker.getPictures(options).then((results) => {
			for (var i = 0; i < results.length; i++) {
				let correctPath = results[i].split('?');
				let currentName = results[i].substring(results[i].lastIndexOf('/') + 1, results[i].lastIndexOf('?'));
			}
		}, (err) => {
			console.log("Error in selecting Image", err);
		});
	}

	// Create options for the Camera Dialog
	public takePicture(sourceType) {
		var options = {
			quality: 50,
			sourceType: sourceType,
			saveToPhotoAlbum: true,
			correctOrientation: true
		};
		this.camera.getPicture(options).then((imagePath) => {
			if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
				let correctPath = imagePath.split('?');
				let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
			} else {
				let correctPath = imagePath.split('?');
				let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
			}
		}, (err) => {
			console.log('Error while selecting image');
		});
	}
}
