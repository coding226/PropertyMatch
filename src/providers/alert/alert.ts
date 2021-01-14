import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class AlertProvider {
	constructor(public alertCtrl: AlertController) { }
	showAlert(title, msg) {
		const alert = this.alertCtrl.create({
			title: title,
			subTitle: msg,
			buttons: ['OK']
		});
		alert.present();
	}
}
