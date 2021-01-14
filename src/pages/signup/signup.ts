import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})

export class SignupPage {
	signupForm: FormGroup;
	callingcodes: any = [];
	passwordType: string = 'password';
  	passwordIcon: string = 'eye-off';
	constructor(
		translate: TranslateService,
		public navCtrl: NavController,
		public navParams: NavParams,
		public user: UserProvider,
		public api: ApiProvider,
		public alert: AlertProvider,
		public loader: LoaderProvider
		) {
		translate.setDefaultLang(localStorage.language);
		this.signupForm = new FormGroup({
			username: new FormControl('', Validators.required),
			email: new FormControl(
				'',
				Validators.compose([
					Validators.required,
					Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
					])
				),
			password: new FormControl('', Validators.required),
			gender: new FormControl(''),
			mobile_no: new FormControl('', Validators.required),
			code: new FormControl('', Validators.required),
		});
	}
	ionViewDidEnter() {
		this.user.getCallingCodes().subscribe(r => {
			const sorted = _.sortBy(r, 'name');
			this.callingcodes = sorted;
		});
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}
	/** go to login page */
	login() {
		this.navCtrl.setRoot('LoginPage');
	}
	/** go to verify number */
	verify() {
		this.navCtrl.setRoot('VerificationNumberPage');
	}

	/** do signup */
	doSignUp() {
		let codedata = this.signupForm.value.code.split(',');
		this.loader.presentLoading();
		let params = {
			name: this.signupForm.value.username,
			password: this.signupForm.value.password,
			email: this.signupForm.value.email.toLowerCase(),
			mobile: codedata[0].replace('+', '') + this.signupForm.value.mobile_no,
			gender: this.signupForm.value.gender,
		};
		this.api.post(params, 'api/auth/register').subscribe(
			data => {
				this.loader.dimissLoading();
				if (data.status === 200) {
					this.alert.showAlert('Message', 'Thank you for signup into our app!');
					this.navCtrl.setRoot('VerificationNumberPage', {
						id: data.data.id,
						mobile: data.data.mobile,
						userdata: data.data,
					});
				} else {
					this.alert.showAlert('Error', data.message);
				}
			},
			err => {
				this.loader.dimissLoading();
				this.alert.showAlert('Error', 'Server not responding');
			});
	}

	checkMobileNumber() {
		let mobileNumber = this.signupForm.value.mobile_no;
		while (mobileNumber.charAt(0) === '0') {
			mobileNumber = mobileNumber.substr(1);
			this.signupForm.patchValue({
				mobile_no: mobileNumber
			});
		}
	}

	hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
