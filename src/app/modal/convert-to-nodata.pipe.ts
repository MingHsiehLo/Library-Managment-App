import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'convertToNoData'
})

export class ConvertToNoDataPipe implements PipeTransform {
    transform(value: string,): string {
      if (value === null){
        return 'Pending'
      }
      else {
        return value
      }
    }
}
