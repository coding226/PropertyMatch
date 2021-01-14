var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { ProfilePage } from './profile';
import { ShareModule } from '../../shared/ShareModule';
var ProfilePageModule = /** @class */ (function () {
    function ProfilePageModule() {
    }
    ProfilePageModule = __decorate([
        NgModule({
            declarations: [
                ProfilePage,
            ],
            imports: [
                ShareModule,
                IonicPageModule.forChild(ProfilePage),
                GooglePlacesAutocompleteComponentModule
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ],
        })
    ], ProfilePageModule);
    return ProfilePageModule;
}());
export { ProfilePageModule };
//# sourceMappingURL=profile.module.js.map