import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';


import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-personal-setting',
  templateUrl: 'personal-setting.html',
})
export class PersonalSettingPage {
  name: string;
  email: string;
  date_of_birth: string = '';
  constructor(translate: TranslateService, public navCtrl: NavController, public api: ApiProvider, public nativeStorage: NativeStorage, public navParams: NavParams, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider) {
    console.log("this.user....", this.user);
    translate.setDefaultLang(localStorage.language);
    this.name = this.user.name;
    this.email = this.user.email;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalSettingPage');
  }
  ionViewWillEnter() {
    this.user.hideTabs = true;
    this.getStatus();
  }

  ionViewWillLeave() {
    this.user.hideTabs = false;
  }

  /** edit personal information */

  editInfo() {
    this.loader.presentLoading();
    let params = {
      user_id: this.user.user_id,
      name: this.name,
      dob: this.date_of_birth || '',
      email: this.email,
      description: this.user.short_description,
    }

    this.user.callApi(params, 'edit_seeker_profile').subscribe(data => {
      console.log(data);
      this.loader.dimissLoading();
      if (data.status != 0) {
        this.nativeStorage.clear();
        this.nativeStorage.setItem('user_data', { data: data.data })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        this.user.user_id = data.data.id;
        this.user.name = data.data.name;
        this.user.short_description = data.data.description;
        this.user.status = data.data.status;
        this.user.gender = data.data.gender;
        this.user.occupation = data.data.occupation;
        this.user.age = data.data.age;
        this.user.profile_image = data.data.profile_image;
        // this.alert.showAlert('Message', "Updated successfully");
        this.navCtrl.push("SettingsPage", { id: this.user.user_id }).then(() => {
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(index - 1);
          //this.navCtrl.remove(index - 2);
        })


      } else {
        this.alert.showAlert('Error', data.message);
      }
    }, err => {
      this.loader.dimissLoading();
      this.alert.showAlert('Error', err);
      console.log(err);
    })
  }

  /** get attribute */
  getStatus() {
    this.loader.presentLoading();

    let params = {
      user_id: this.user.user_id,

    }

    this.user.callApi(params, 'get_user_data').subscribe(data => {
      console.log("getStatus..", data);
      this.loader.dimissLoading();
      if (data.status != 0) {
        this.nativeStorage.clear();
        this.nativeStorage.setItem('user_data', { data: data.data })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        this.user.user_id = data.data.id;
        this.user.email = data.data.email;
        this.user.email_verified = data.data.email_verified;
        this.user.name = data.data.name;
        // this.user.short_description = data.data.description;
        this.user.short_description = "";
        this.user.status = data.data.status;
        this.user.gender = data.data.gender;
        this.user.occupation = data.data.occupation;
        this.user.age = data.data.age;
        this.user.profile_image = data.data.profile_image;
        this.date_of_birth = data.data.dob

      } else {
        this.alert.showAlert('Error', data.message);
      }
    }, err => {
      this.loader.dimissLoading();
      this.alert.showAlert('Error', err);
      console.log(err);
    })
  }

  /** resend email */

  resendVerification() {
    this.loader.presentLoading();

    let params = {
      user_id: this.user.user_id,
      email: this.email
    }

    this.user.callApi(params, 'resend_email_verification').subscribe(data => {
      console.log(data);
      this.loader.dimissLoading();
      if (data.status != 0) {
        this.nativeStorage.clear();
        this.nativeStorage.setItem('user_data', { data: data.data })
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        this.user.user_id = data.data.id;
        this.user.email = data.data.email;
        this.user.email_verified = data.data.email_verified;
        this.user.name = data.data.name;
        this.user.short_description = data.data.description;
        this.user.status = data.data.status;
        this.user.gender = data.data.gender;
        this.user.occupation = data.data.occupation;
        this.user.age = data.data.age;
        this.user.profile_image = data.data.profile_image;
        // this.alert.showAlert('Message', data.message);
        this.navCtrl.push("SettingsPage", { id: this.user.user_id }).then(() => {
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(index - 1);
          //this.navCtrl.remove(index - 2);
        })


      } else {
        this.alert.showAlert('Error', data.message);
      }
    }, err => {
      this.loader.dimissLoading();
      this.alert.showAlert('Error', err);
      console.log(err);
    })
  }

  getProfile() {
    if (this.user.profile_image != null) {
      if (this.user.profile_image.startsWith('file')) {
        return this.user.profile_image
      }
      return this.api.IMAGE_URL + this.user.profile_image
    } else {
      return 'assets/imgs/profile.jpg';
    }
  }
}
