import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { TranslateService } from '@ngx-translate/core';

@IonicPage({
	name: 'ChooseLanguagePage'
})
@Component({
	selector: 'page-choose-language',
	templateUrl: 'choose-language.html',
})
export class ChooseLanguagePage {
	current: string;
	formSettingPage: Boolean;
	constructor(
		public translate: TranslateService,
		public navParams: NavParams,
		public navCtrl: NavController,
		public events: Events,
		) {
		translate.setDefaultLang(localStorage.language);
	}

	ionViewWillEnter() {
		this.current = localStorage.language;
		this.translate.setDefaultLang(localStorage.language);
		if (this.navParams.get('path') === 'setting' && this.navCtrl.canGoBack()) {
			this.formSettingPage = true;
		}
	}

	chooseLanguage(lang){
		this.current = lang;
		localStorage.setItem("language", lang);
		this.translate.setDefaultLang(this.current);
		if(this.formSettingPage) {
			this.events.publish('CHANGE_LANGUAGE');
			setTimeout(() => {
				this.navCtrl.setRoot(TabsPage);
			});
			// location.assign('/');
		} else {
			this.navCtrl.setRoot("demo");
		}
	}

	enter(){
		this.navCtrl.setRoot("demo");
	}

}
