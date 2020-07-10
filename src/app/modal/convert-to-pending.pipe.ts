import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'convertToPending'
})

export class ConvertToPendingPipe implements PipeTransform {
    transform( value: string ): string {
      if (value === null){
        return 'Pending'
      }
      else {
        return value
      }
    }
}
