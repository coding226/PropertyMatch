import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-add-appointment',
	templateUrl: 'add-appointment.html',
})
export class AddAppointmentPage {
	start_time: any = new Date().toISOString();
	eventSource;
	viewTitle = new Date().getMonth();
	isToday: boolean;
	calendar = {
		mode: 'month',
		currentDate: new Date()
	}; // these are the variable used by the calendar.
	selected_date: any = new Date().toISOString().slice(0, 10);
	selected_time: any;
	constructor(translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public user: UserProvider, public api: ApiProvider, public alert: AlertProvider, public loader: LoaderProvider) {
		console.log("start_time", this.start_time);
		translate.setDefaultLang(localStorage.language);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddAppointmentPage');
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
		console.log("onViewTitleChanged", title)
	}
	onEventSelected(event) {
		console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
	}
	changeMode(mode) {
		this.calendar.mode = mode;
	}
	today() {
		this.calendar.currentDate = new Date();
	}
	onTimeSelected(ev) {
		this.selected_date = new Date(ev.selectedTime).toISOString().slice(0, 10);
	}
	onCurrentDateChanged(event: Date) {
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		event.setHours(0, 0, 0, 0);
		this.isToday = today.getTime() === event.getTime();
	}

	/** get start time */
	getStartTime() {
		console.log(this.start_time);
		var time = new Date(this.start_time);
		console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
		this.selected_time = this.start_time + ":00";
	}


	/** seeker match request */
	createAppointment() {

		if (this.selected_time == undefined) {
			this.alert.showAlert("Error", "Please select appoinment time");
		} else {
			let params = {
				sender_id: this.user.user_id,
				receiver_id: this.navParams.get('reciever_id'),
				property_id: this.navParams.get('property_id'),
				date: this.selected_date,
				time: this.selected_time
			}
			this.loader.presentLoading();
			this.user.callApi(params, 'appointment').subscribe(data => {
				this.loader.dimissLoading();
				if (data.status != 0) {

					this.alert.showAlert("Message", "Appointment Created");
					this.sendMessage(data.data.id);

				} else {
					this.alert.showAlert("Error", data.message);
				}
			}, err => {
				this.loader.dimissLoading();
				this.alert.showAlert("Error", "Server is not responding");
				console.log(err);
			})
		}

	}

	/** send message */
	sendMessage(appoinment_id) {

		let d = new Date(this.selected_date);
		let options = {
			weekday: "long", year: "numeric", month: "short",
			day: "numeric",
		};

		let date_of_appointment = d.toLocaleTimeString("en-us", options).substring(0, d.toLocaleTimeString("en-us", options).lastIndexOf(",") + 1);
		let params = {
			sender_id: this.user.user_id,
			receiver_id: this.navParams.get('reciever_id'),
			message: "An appointment has been created,Please confirm?" + date_of_appointment + this.start_time,
			property_id: this.navParams.get('property_id'),
			appointment_id: appoinment_id
		}
		this.user.callApi(params, 'chat').subscribe(data => {
			if (data.status != 0) {
				if (this.navParams.get('path') == 'profile') {
					this.navCtrl.push("chat-view", { property_id: this.navParams.get('property_id'), id: this.navParams.get('reciever_id'), title: this.navParams.get('chat_title') }).then(() => {
						const index = this.navCtrl.getActive().index;
						this.navCtrl.remove(index - 1);
					})
				} else {
					this.navCtrl.push("chat-view", { property_id: this.navParams.get('property_id'), id: this.navParams.get('reciever_id'), title: this.navParams.get('chat_title') }).then(() => {
						const index = this.navCtrl.getActive().index;
						this.navCtrl.remove(index - 1);
						this.navCtrl.remove(index - 2);
					})
				}
			}
		}, err => {
			console.log(err);
		})
	}
}
