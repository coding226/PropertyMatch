import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderProvider {
	loader: any = '';
	constructor(public loadingCtrl: LoadingController) { }

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
		});
		this.loader.present();
	}

	dimissLoading() {
		this.loader.dismiss();
	}

	readDevicestate(){
		document.addEventListener("pause", function() {}, true);
		document.addEventListener("resume", function() {
		}, true);
	}
}
