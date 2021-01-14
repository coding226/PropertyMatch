var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeekerHomePage } from './seeker-home';
import { SwingModule } from 'angular2-swing';
import { ShareModule } from '../../shared/ShareModule';
var SeekerHomePageModule = /** @class */ (function () {
    function SeekerHomePageModule() {
    }
    SeekerHomePageModule = __decorate([
        NgModule({
            declarations: [
                SeekerHomePage,
            ],
            imports: [
                ShareModule,
                IonicPageModule.forChild(SeekerHomePage), SwingModule
            ], exports: [SeekerHomePage]
        })
    ], SeekerHomePageModule);
    return SeekerHomePageModule;
}());
export { SeekerHomePageModule };
//# sourceMappingURL=seeker-home.module.js.map