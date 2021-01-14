import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { StackConfig, DragEvent, SwingStackComponent, SwingCardComponent, Direction } from 'angular2-swing';
import { TabsPage } from '../tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
@IonicPage({
	name: 'demo'
})
@Component({
	selector: 'demo',
	templateUrl: 'demo.html',
})
export class DemoPage {
	properties: any = [];
	@ViewChild('myswing1') swingStack: SwingStackComponent;
	@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
	cardslength: any;
	cards: any = [];
	stackConfig: StackConfig;
	recentCard: string = '';
	imageUrl: string = "";
	errormsg: any = '';
	pageNo: number = 1;
	constructor(translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider) {
		translate.setDefaultLang(localStorage.language);
		this.imageUrl = this.api.IMAGE_URL;
		this.stackConfig = {
			allowedDirections: [Direction.LEFT, Direction.RIGHT],
			throwOutConfidence: (offsetX, offsetY, element) => {
				return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
			},
			transform: (element, x, y, r) => {
				this.onItemMove(element, x, y, r);
			},
			throwOutDistance: (d) => {
				return 800;
			}
		};
	}

	ngOnInit() {
	}

	ngAfterViewInit() {

	}

	ionViewWillEnter() {
		const timestamp = Date.now() + Math.random();
		if (!localStorage.user_id) {
			localStorage.setItem('demo_id', timestamp + '');
			this.swingStack.throwin.subscribe((event: DragEvent) => {
				event.target.style.background = '#ffffff';
			});
			this.cards = [];
			this.getProperties();
		} else {
			this.navCtrl.setRoot(TabsPage);
		}
	}

	onItemMove(element, x, y, r) {
		var color = '';
		var abs = Math.abs(x);
		let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
		let hexCode = this.decimalToHex(min, 2);
		if (x < 0) {
			color = '#FF' + hexCode + hexCode;
		} else {
			color = '#' + hexCode + 'FF' + hexCode;
		}
		element.style.background = color;
		element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
	}

	// Connected through HTML
	voteUp($event) {
		// this.swipeLeft($event);
		this.goToSettings();
	}

	decimalToHex(d, padding) {
		var hex = Number(d).toString(16);
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

		while (hex.length < padding) {
			hex = "0" + hex;
		}
		return hex;
	}

	/** get properties */
	getProperties(reset = 0) {
		this.api.get({
			page: this.pageNo,
			reset: reset
		}, 'api/explorer/159').subscribe(data => {
			if (data.status != 0) {
				const list = [...data.data];
				const cards = [];
				if (list.length > 0) {
					list.reverse();
					const hasIds = list.map(item => item.id);
					for (let i = 0; i < list.length; i++) {
						if (hasIds.indexOf(list[i].id) >= 0) {
							cards.push({
								image_path: (list[i].mainimage.length > 0 && list[i].mainimage[0].image_path) ? list[i].mainimage[0].image_path : "",
								title: list[i].title,
								address: list[i].address,
								id: list[i].id,
								user_id: list[i].user_id,
								alldata: list[i],
							})
						}
					}
					this.properties = [...list];
					this.cards = [...cards];
				} else {
					this.cards = [];
				}
			} else {
				this.cards = [];
			}
		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}
	/** go to property detail */
	propertyDetail(detail: any) {
		const modal = this.modalCtrl.create("PropertyDetailPage", { detail: detail });
		modal.onDidDismiss((data) => {
			if (data) {
				if (data.option == 'cancel') {
					this.swipeLeft(null)
				}
				if (data.option == 'accept') {
					this.cards.pop();
				}
				this.checkPropertyLength()
			}
		});
		modal.present();
	}

	/** make request */
	makeRequest(property_id, landlord_id, status) {
		// this.loader.presentLoading();
		let params = {
			user_id: 152,
			property_id: property_id,
			request: status
		}
		this.api.post(params, 'api/requests').subscribe(data => {
			// this.acceptRejectProperty(this.user.user_id, property_id, 1);
			if (data.status === 200) {
				this.cards.pop();
			}
		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	swipeRight(event) {
		let ids = event.target.id.split("|");
		this.makeRequest(ids[0], ids[1], null);
	}

	swipeLeft(event) {
		let ids = event.target.id.split("|");
		this.makeRequest(ids[0], ids[1], null);
	}

	acceptRejectProperty(userId, propertyId, type) {
		// let params = {
		// 	user_id: localStorage.demo_id,
		// 	property_id: propertyId,
		// 	request: type
		// }
		this.cards.pop();
	}

	getPropertyString(propertyId: any) {
		let prpertyTypes = this.user.property_type_array;
		let propertyTypeData = prpertyTypes.filter((arr) => {
			return arr.id == propertyId
		})[0];
		return propertyTypeData.title
	}

	checkPropertyLength() {
		if (this.cards.length === 0) {
			this.navCtrl.push("GetstartedPage");
		}
	}

	goToSettings() {
		this.navCtrl.push("GetstartedPage");
	}

	title(p) {
		return p.title;
	}

	printPrice(p) {
		if (p.alldata.property_for === '0') {
			return this.numberWithCommas(p.alldata.rent_cost);
		} else if (p.alldata.property_for === '1') {
			return this.numberWithCommas(p.alldata.buy_cost);
		} else {
			return this.numberWithCommas(p.alldata.buy_cost);
		}
	}

	numberWithCommas(x) {
		if (!!x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return 0.0;
	}
}
