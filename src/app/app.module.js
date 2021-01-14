var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, ErrorHandler, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events, } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { FCM } from '@ionic-native/fcm';
import { Facebook } from '@ionic-native/facebook';
// import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { NgCalendarModule } from 'ionic2-calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { SwingModule } from 'angular2-swing';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { GoogleMaps } from '@ionic-native/google-maps';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { UserProvider } from '../providers/user/user';
import { AlertProvider } from '../providers/alert/alert';
import { LoaderProvider } from '../providers/loader/loader';
import { ShareModule } from '../shared/ShareModule';
var AppModule = /** @class */ (function () {
    function AppModule(fcm, events, _ngZone, localNotifications, user) {
        //   this.fcm.subscribeToTopic('all');
        this.fcm = fcm;
        this.events = events;
        this._ngZone = _ngZone;
        this.localNotifications = localNotifications;
        this.user = user;
        //   this.fcm.getToken().then(token => {
        //   console.log(token);
        //   this.user.device_id = token;
        //   //backend.registerToken(token);
        //   });
        // this.fcm.onNotification().subscribe(data => {
        //   console.log(data);
        //   this.events.publish('MESSAGE:RECIEVED', data);
        //   this.user.message_badge =  this.user.message_badge + 1;
        //    this._ngZone.run(() => {
        //       console.log("gwokeddd")
        //     });
        //   if(data.wasTapped){
        //     console.log("Received in background");
        //   } else {
        //     console.log("Received in foreground");
        //     // Schedule a single notification
        //     this.localNotifications.schedule({
        //       id: 1,
        //         title: 'PropertyMatch',
        //         text: JSON.parse(data.data).message,
        //     });
        //   };
        // });
        // this.fcm.onTokenRefresh().subscribe(token => {
        //   //backend.registerToken(token);
        //    console.log(token, 'token refresh');
        // });
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                TabsPage
            ],
            imports: [
                ShareModule,
                BrowserModule,
                HttpModule,
                GooglePlacesAutocompleteComponentModule,
                NgCalendarModule, SwingModule,
                IonicModule.forRoot(MyApp, { mode: 'ios', backButtonText: '', pageTransition: 'ios' }),
                IonicImageViewerModule
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                TabsPage
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Facebook,
                // GooglePlus,
                NativeStorage,
                Camera,
                FileTransfer,
                Crop,
                Geolocation,
                GoogleMaps,
                LocalNotifications,
                FCM,
                InAppPurchase,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                ApiProvider,
                UserProvider,
                AlertProvider,
                LoaderProvider,
                ImagePicker
            ]
        }),
        __metadata("design:paramtypes", [FCM, Events, NgZone, LocalNotifications, UserProvider])
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map