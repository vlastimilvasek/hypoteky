import { Pipe, PipeTransform } from '@angular/core';

const PADDING = '000000';

@Pipe({
    name: 'menaFormat'
})
export class MenaFormatPipe implements PipeTransform {

    transform(value: string): string {
        let res = '';
        if (!isNaN(Number(value)) && Number(value)) {
            const cislo = Math.round( Number(value || ''));
            if (cislo > 0) {
                res = cislo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;') + '&nbsp;Kč';
            }
        }
        return res;
    }
}
