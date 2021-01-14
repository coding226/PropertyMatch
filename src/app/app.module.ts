import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {HttpModule} from '@angular/http';
import {MyApp} from './app.component';
import {HTTP} from '@ionic-native/http';

import {FCM} from '@ionic-native/fcm';
import {Facebook} from '@ionic-native/facebook';
import {NativeStorage} from '@ionic-native/native-storage';
import {Camera} from '@ionic-native/camera';
import {Crop} from '@ionic-native/crop';
import {FileTransfer} from '@ionic-native/file-transfer';
import {Geolocation} from '@ionic-native/geolocation';
import {GooglePlacesAutocompleteComponentModule} from 'ionic2-google-places-autocomplete';
import {NgCalendarModule} from 'ionic2-calendar';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {InAppPurchase} from '@ionic-native/in-app-purchase';
import {SwingModule} from 'angular2-swing';
import {IonicImageViewerModule} from 'ionic-img-viewer';
import {ImagePicker} from '@ionic-native/image-picker';
import {
    GoogleMaps,
} from '@ionic-native/google-maps';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ApiProvider} from '../providers/api/api';
import {UserProvider} from '../providers/user/user';
import {AlertProvider} from '../providers/alert/alert';
import {LoaderProvider} from '../providers/loader/loader';
import {ShareModule} from '../shared/ShareModule';
import {LineLogin} from '@ionic-native/line-login';

@NgModule({
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
        IonicModule.forRoot(MyApp, {mode: 'ios', backButtonText: '', pageTransition: 'ios'}),
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
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ApiProvider,
        UserProvider,
        AlertProvider,
        LoaderProvider,
        ImagePicker,
        HTTP,
        LineLogin
    ]
})

export class AppModule {
    constructor() {
    }
}
