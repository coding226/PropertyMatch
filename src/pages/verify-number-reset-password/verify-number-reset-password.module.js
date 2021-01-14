var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyNumberResetPasswordPage } from './verify-number-reset-password';
import { PipesModule } from '../../pipes/pipes.module';
import { ShareModule } from '../../shared/ShareModule';
var VerifyNumberResetPasswordPageModule = /** @class */ (function () {
    function VerifyNumberResetPasswordPageModule() {
    }
    VerifyNumberResetPasswordPageModule = __decorate([
        NgModule({
            declarations: [
                VerifyNumberResetPasswordPage,
            ],
            imports: [
                ShareModule,
                IonicPageModule.forChild(VerifyNumberResetPasswordPage),
                PipesModule
            ],
        })
    ], VerifyNumberResetPasswordPageModule);
    return VerifyNumberResetPasswordPageModule;
}());
export { VerifyNumberResetPasswordPageModule };
//# sourceMappingURL=verify-number-reset-password.module.js.map