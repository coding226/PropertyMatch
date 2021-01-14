import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from './../../providers/user/user';
import { AlertProvider } from './../../providers/alert/alert';
import { LoaderProvider } from './../../providers/loader/loader';
import { ApiProvider } from './../../providers/api/api';
import { StackConfig, DragEvent, SwingStackComponent, SwingCardComponent, Direction } from 'angular2-swing';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@IonicPage()
@Component({
	selector: 'page-seeker-home',
	templateUrl: 'seeker-home.html',
})
export class SeekerHomePage {
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
	showInfo: boolean = false;
	constructor(translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public api: ApiProvider, public user: UserProvider, public alert: AlertProvider, public loader: LoaderProvider, public geolocation: Geolocation) {
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

		this.resetSearchForm();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.swingStack.throwin.subscribe((event: DragEvent) => {
			event.target.style.background = '#ffffff';
		});
	}

	ionViewWillEnter() {
		this.getProperties();
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
		this.showInfo = false;
		let params = {
			// user_id: this.user.user_id,
			page: this.pageNo,
			reset: reset,
		};
		this.api.get(params, 'api/explorer/' + this.user.user_id).subscribe(data => {
			if (data.status === 200) {
				if (data.data.length > 0) {
					this.properties = [...data.data.reverse()];
					const hasIds = this.cards.map(item => item.id);
					const list = [];
					for (let i = 0; i < this.properties.length; i++) {
						if (hasIds.indexOf(this.properties[i].id) < 0) {
							list.push({
								image_path: (this.properties[i].mainimage.length > 0 && this.properties[i].mainimage[0].image_path) ? this.properties[i].mainimage[0].image_path : "",
								title: this.properties[i].title,
								address: this.properties[i].address,
								id: this.properties[i].id,
								user_id: this.properties[i].user_id,
								alldata: this.properties[i],
								// country:this.properties[i].country,
								// house_name:this.properties[i].house_name,
								// bedroom:this.properties[i].bedroom,
								// property_size:this.properties[i].property_size,
								// bathroom:this.properties[i].bathroom,
								// buy_cost:this.properties[i].buy_cost,
								// rent_cost:this.properties[i].rent_cost,
								// nearest_transport:this.properties[i].nearest_transport,
								// description:this.properties[i].description,
								// room_no:this.properties[i].room_no,
								// city:this.properties[i].city,
								// region:this.properties[i].region,
								// attributes:this.properties[i].attributes
							})
						}
					}
					this.cards = this.cards.concat(list);
					console.log('this.cards = ', this.cards);
				} else {
					this.cards = [];
					this.showInfo = true;
				}
				// this.cards=data.data;
				// console.log(this.cards)
			} else {
				this.cards = [];
				this.showInfo = true;
				// this.errormsg = data.error + 'Please change your search settings in profile.';
				// this.alert.showAlert("Error", 'Please change your search settings in profile.');
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
					// this.voteUp(false, detail.id)
					this.cards.pop();
				}
				if (data.option == 'accept') {
					this.cards.pop();
				}
			}
		});
		modal.present();
	}

	goToSettings() {
		this.navCtrl.push("SettingsPage");
	}

	voteUp(like: boolean, propertyId) {
		this.makeRequest(this.user.user_id, propertyId, null);
	}

	swipeRight(event) {
		let ids = event.target.id.split("|");
		this.makeRequest(ids[0], ids[1], 0);
	}

	swipeLeft(event) {
		let ids = event.target.id.split("|");
		this.makeRequest(ids[0], ids[1], null);
	}

	makeRequest(property_id, landlord_id, status) {
		// this.loader.presentLoading();
		let params = {
			user_id: this.user.user_id,
			property_id: property_id,
			request: status
		}
		this.api.post(params, 'api/requests').subscribe(data => {
			// this.acceptRejectProperty(this.user.user_id, property_id, 1);
			if (data.status === 200) {
				this.cards.pop();
				if (this.cards.length === 0) {
					this.showInfo = true;
				}
			}

		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	acceptRejectProperty(userId, propertyId, type) {
		let params = {
			user_id: userId,
			property_id: propertyId,
			request: type
		}
		this.api.post(params, 'requests').subscribe(data => {
			this.cards.pop();
			this.checkPropertyLength();
		}, err => {
			this.alert.showAlert("Error", 'Server not responding');
		})
	}

	getPropertyString(propertyId: any) {
		if (this.user.property_type_array) {
			let prpertyTypes = this.user.property_type_array;
			let propertyTypeData = prpertyTypes.filter((arr) => {
				return parseInt(arr.id) === propertyId
			})[0];
			if (propertyTypeData) {
				return propertyTypeData.title
			}
		}
		return '';
	}

	checkPropertyLength() {
		if (this.cards.length === 0) {
			this.pageNo++;
			this.getProperties(1);
		}
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
		if (x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} else {
			return '';
		}
	}

	setCenter($event) {
	}

	/** get current position */
	getCurrentPosition() {
		var env = this;
		this.geolocation.getCurrentPosition().then((resp) => {
			this.user.latitude = resp.coords.latitude;
			this.user.longitude = resp.coords.longitude;
			var lat = this.user.latitude;
			var lng = this.user.longitude;
			var latlng = new google.maps.LatLng(lat, lng);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					let a = results[1].address_components;
					// console.log(a);
					env.user.city = a[1].short_name;
					env.user.state = a[2].long_name;
					env.user.country = a[3].long_name;
					if (results[1]) {
						// console.log(results[1]);
						// console.log("Location: " + results[1].formatted_address);
					}
				}
			});

			//  this.loadMap();
		}).catch((error) => {
			console.log('Error getting location', error);
		});
	}

	resetSearchForm() {
		let selectedType = [];
		this.user.search_type = "";
		this.user.search_range = 0.0;
		this.user.price_range = "";
		this.user.price_range2 = "";
		this.user.city = "";
		this.user.state = "";
		this.user.country = "";
		this.user.rent_duration = "";
		for (let a of this.user.attribute) {
			a.checked = false;
		}
		this.user.bedroom = -1;
		this.user.bathroom = -1;
		this.user.sqm = 0;
		this.getCurrentPosition();

		const attrs = this.user.attribute;
		const getChecked = attrs.filter(item => item.checked === true)
		.map(item => item.id);
		const params = {
			attributes: getChecked.join(','),
			property_type: selectedType.join(','),
			search_type: this.user.search_type,
			search_range: this.user.search_range,
			min_price: parseInt(this.user.price_range),
			max_price: parseInt(this.user.price_range2),
			city: this.user.city,
			region: this.user.state,
			country: this.user.country,
			lat: this.user.latitude,
			lon: this.user.longitude,
			rent_duration: this.user.rent_duration,
			bedroom: this.user.bedroom,
			bathroom: this.user.bathroom,
			sqm: this.user.sqm
		};
		this.commonUpdateAPI(params);
	}

	commonUpdateAPI(params) {
		this.api.put(params, 'api/users/' + localStorage.user_id).subscribe(data => {
		}, err => {
			console.log(err);
		});
	}
}
