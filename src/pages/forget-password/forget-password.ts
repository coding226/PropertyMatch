import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { ApiProvider } from "./../../providers/api/api";
import { UserProvider } from "./../../providers/user/user";
import { AlertProvider } from "./../../providers/alert/alert";
import { LoaderProvider } from "./../../providers/loader/loader";
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  name: "forget-password"
})
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  forgetPasswordForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public user: UserProvider,
    public alert: AlertProvider,
    public loader: LoaderProvider,
    translate: TranslateService,
    ) {
    translate.setDefaultLang(localStorage.language);
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl("", Validators.required),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }

  submitPasswordReques() {
    this.loader.presentLoading();
    let params = { email: this.forgetPasswordForm.value.email };
    this.api.post(params, "api/users/forget").subscribe(data => {
      this.loader.dimissLoading();
      if (data.status === 200) {
        this.navCtrl.setRoot("VerifyNumberResetPasswordPage", {
          id: data.data.id
        });
      } else {
        this.alert.showAlert("Error", data.message);
      }
    },
    err => {
      this.loader.dimissLoading();
      this.alert.showAlert("Error", "Server not responding");
    }
    );

  }

}
