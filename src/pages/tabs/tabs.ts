import { Component, ViewChild } from '@angular/core';
import { UserProvider } from './../../providers/user/user';
import { ApiProvider } from './../../providers/api/api';
import { NavParams, Platform, Tabs, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
	templateUrl: 'tabs.html',
})

export class TabsPage {
	showTab = true;
	tab1Root = "SeekerHomePage";
	tab2Root = "ProfilePage";
	tab3Root = "MessagesPage";
	tabs = [
	{
		root: 'ProfilePage',
		tabTitle: 'Profile',
		tabIcon: 'md-person',
		tabBadge: null,
		tabBadgeStyle: null,
	},
	{
		root: 'SeekerHomePage',
		tabTitle: 'Home',
		tabIcon: 'ios-home',
		tabBadge: null,
		tabBadgeStyle: null,
	},
	{
		root: 'MessagesPage',
		tabTitle: 'Messages',
		tabIcon: 'md-chatboxes',
		tabBadge: 0,
		tabBadgeStyle: 'danger'
	},
	];
	showBadge = true;
	index: number;
	@ViewChild('myTabs') tabRef: Tabs;
	constructor(
		translate: TranslateService,
		public events: Events,
		public api: ApiProvider,
		public user: UserProvider,
		public navParams: NavParams,
		public platform: Platform,
		private localNotifications: LocalNotifications
	) {
		translate.setDefaultLang(localStorage.language);
		events.subscribe('CHANGE_LANGUAGE', (res) => {
			// this.showTab = false;
			setTimeout(() => {
				// this.showTab = true;
			}, 10);
		});
		events.subscribe('notification clicked', (res) => {
			this.tabRef.select(2);
		});
		events.subscribe('MESSAGE:RECIEVED', (res) => {
			this.getNewMessage();
		});
		events.subscribe('NEWMESSAGE', (res) => {
			this.getNewMessage();
		});

	}

	getNewMessage() {
		let params = {
			user_id: this.user.user_id,
		}
		this.api.get(params, 'api/chats/unread').subscribe(data => {
			if (data.status === 200) {
				this.user.message_badge = data.data.length;
				this.tabs[2].tabBadge = data.data.length;
				this.tabs[2].tabBadgeStyle = 'danger';
			} else {
				this.tabs[2].tabBadge = null;
				this.tabs[2].tabBadgeStyle = '';
			}
		});
	}

	ionViewWillEnter() {
		this.tabs[2].tabBadge = null;
		this.getNewMessage();
		if (this.navParams.get('index')) {
			this.index = 1;
		} else {
			this.index = 0;
		}
	}
}
