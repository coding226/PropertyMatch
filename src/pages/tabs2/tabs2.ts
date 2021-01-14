import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-tabs2',
  templateUrl: 'tabs2.html',
})
export class Tabs2Page {
  tab1Root = "SeekerHomePage";
  tab2Root = "ProfilePage";
  tab3Root = "MessagesPage";
  constructor(translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public user: UserProvider) {
    translate.setDefaultLang(localStorage.language);
  }


}
