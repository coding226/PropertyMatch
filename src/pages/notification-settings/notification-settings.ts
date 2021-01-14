import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-notification-settings',
  templateUrl: 'notification-settings.html',
})
export class NotificationSettingsPage {
  newMatches: any;
  messages: any;
  inAppSound: any;
  inappVibrations: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public api: ApiProvider,
    private nativeStorage: NativeStorage,
    translate: TranslateService,
    ) {
    translate.setDefaultLang(localStorage.language);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationSettingsPage');
    // debugger;
    this.updatePreferenceUI();
  }

  ionViewWillEnter() {
    this.user.hideTabs = true;
    this.api.get({}, 'api/users/' + localStorage.user_id).subscribe(data => {
      if (data.status === 200) {
        this.user.setting_newmatches = data.data.setting_newmatches;
        this.user.setting_messages = data.data.setting_messages;
        this.user.setting_inappvibrations = data.data.setting_inappvibrations;
        this.user.setting_inappsound = data.data.setting_inappsound;

        this.updatePreferenceUI();
      }
    });
  }

  ionViewWillLeave() {
    this.user.hideTabs = false;
  }

  updatePreferenceUI() {
    if (this.user.setting_newmatches && (this.user.setting_newmatches === 1)) {
      this.newMatches = true;
    } else {
      this.newMatches = false;
    }

    if (this.user.setting_messages && (this.user.setting_messages === 1 )) {
      this.messages = true;
    } else {
      this.messages = false;
    }

    if (this.user.setting_inappvibrations && (this.user.setting_inappvibrations === 1)) {
      this.inappVibrations = true;
    } else {
      this.inappVibrations = false;
    }

    if (this.user.setting_inappsound && (this.user.setting_inappsound === 1)) {
      this.inAppSound = true;
    } else {
      this.inAppSound = false;
    }
  }

  changePreferances() {
    let params = {
      // user_id: this.user.user_id,
      setting_newmatches: (this.newMatches) ? 1 : 0,
      setting_messages: (this.messages) ? 1 : 0,
      setting_inappvibrations: (this.inappVibrations) ? 1 : 0,
      setting_inappsound: (this.inAppSound) ? 1 : 0
    }
    this.commonUpdateAPI(params);
  }

  commonUpdateAPI(params) {
    this.api.put(params, 'api/users/' + this.user.user_id).subscribe(data => {
      if (data.status === 200) {
        this.user.setting_newmatches = data.data.setting_newmatches;
        this.user.setting_messages = data.data.setting_messages;
        this.user.setting_inappvibrations = data.data.setting_inappvibrations;
        this.user.setting_inappsound = data.data.setting_inappsound;
      }
      // this.nativeStorage.clear();
      // this.nativeStorage.setItem('user_data', { data: data.data })
      // .then(
      //   () => console.log('Stored item!'),
      //   error => console.error('Error storing item', error)
      //   );
    }, err => {
      console.log(err);
    });
  }
}
