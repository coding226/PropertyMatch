import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the VerifyNumberResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-verify-number-reset-password',
 	templateUrl: 'verify-number-reset-password.html',
 })
 export class VerifyNumberResetPasswordPage {
 	passwordForm: FormGroup;
 	@ViewChild('inputFirst') input1;
 	@ViewChild('inputSecond') input2;
 	@ViewChild('inputThird') input3;
 	@ViewChild('inputFour') input4;
 	@ViewChild('inputFive') input5;
 	@ViewChild('inputSix') input6;
 	value1: string;
 	value2: string;
 	value3: string;
 	value4: string;
 	value5: string;
 	value6: string;
 	showVerify = true;
 	userId;
 	id;
 	countDown;
 	counter = 60;
 	tick = 1000;
 	constructor(translate: TranslateService, public navCtrl: NavController, public geolocation: Geolocation, public navParams: NavParams, public api: ApiProvider, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider) {
 		translate.setDefaultLang(localStorage.language);

 		this.passwordForm = new FormGroup({
 			password: new FormControl('', Validators.required),
 			confirmPassword: new FormControl('', Validators.required),
 		});
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad VerificationNumberPage');
 		this.countDown = Observable.timer(0, this.tick)
 		.take(this.counter)
 		.map(() => --this.counter)
 	}
 	ionViewWillEnter() {
 		this.id = this.navParams.get('id');
 	}

 	/** set focus */
 	setfocus(value: any) {
 		switch (value) {
 			case 'inputSecond':
 			this.input2.nativeElement.focus();
 			break;
 			case 'inputThird':
 			this.input3.nativeElement.focus();
 				break;
 				case 'inputFour':
 				this.input4.nativeElement.focus();
 				// this.ref.detectChanges();
 				break;
 				case 'inputFive':
 				this.input5.nativeElement.focus();
 				// this.ref.detectChanges();
 				break;
 				case 'inputSix':
 				this.input6.nativeElement.focus();
 				// this.ref.detectChanges();
 				break;
 				default:
 				break;
 			}
 		}

 		doVerify() {
 			this.loader.presentLoading();
 			var a = this.value1 + this.value2 + this.value3 + this.value4 + this.value5 + this.value6;
 			let params = {
 				verify_code: a
 			}
 			this.api.put(params, 'api/users/' + this.id +'/verify').subscribe(data => {
 				this.loader.dimissLoading();
 				if (data.status === 200) {
 					this.userId = data.data.id;
 					this.showVerify = false;
 				}
 			}, err => {
 				this.loader.dimissLoading();
 				this.alert.showAlert('Error', err);
 			})
 		}

 		doSignUp() {
 			const param = {
 				...this.passwordForm.getRawValue()
 			}

 			if (param.password !== param.confirmPassword) {
 				this.alert.showAlert('Error', 'Password not match');
 				return;
 			}

 			this.api.put({
 				password: param.password,
 			}, 'api/users/' + this.id).subscribe(data => {
 				if (data.status === 200) {
 					this.alert.showAlert("Message", "Change password successfully.");
 					this.navCtrl.setRoot("GetstartedPage");
 				}
 				this.loader.dimissLoading();
 			}, err => {
 				this.loader.dimissLoading();
 				this.alert.showAlert('Error', err);
 			})
 		}
 	}
