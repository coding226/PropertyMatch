import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CountdownPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'countdown',
})
export class CountdownPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
   transform(value: number): string {
      const minutes: number = Math.floor(value/60);
      return ('00'+ minutes).slice(-2) + ':' + ('00'+Math.floor(value-minutes * 60)).slice(-2);
    }
}
