import { NgModule } from '@angular/core';
import { CountdownPipe } from './countdown/countdown';
@NgModule({
	declarations: [CountdownPipe],
	imports: [],
	exports: [CountdownPipe]
})
export class PipesModule {}
