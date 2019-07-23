import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-udaje',
    templateUrl: './udaje.component.html',
    styles: [`.color-box {
        display: inline-block;
        height: 14px;
        width: 14px;
        margin-right: 4px;
        border: 1px solid #000;
    }`],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class UdajeComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() lists;

    public ngxDisabled = false;

    constructor(public sanitizer: DomSanitizer) {
    }

    pridatZastavu(): void {
        const i = this.data.Zastava.length + 1;
        const zastava = {
            Typ: null,
            OdhadniCena: null,
            Region: '',
            Pronajimana: 'false'
        };
        if (i <= 3 ) { this.data.Zastava.push(zastava); }
        // console.log('zastav: ', this.data.Zastava);
    }

    smazZastavu(i: number): void {
        this.data.Zastava.splice(i, 1);
        // console.log('zastav: ', this.data.Zastava);
    }

    style(data: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(data);
    }

    flag(data: string): string {
        return '<img src="https://www.srovnavac.cz/components/com_cestovka/assets/images/flags/' + data.toLowerCase() + '.png">';
    }

    ngOnInit() {
        if ( !this.data.Zastava.length ) { this.pridatZastavu(); }
        this.lists.colors = [
            {value: 1, label: 'Evropa', hex: 'EVR'},
            {value: 2, label: 'Celý svět', hex: 'WRL'},
            {value: 3, label: 'Afghánistán', hex: 'AFG'},
            {value: 4, label: 'Albánie', hex: 'ALB'},
            {value: 5, label: 'Alžírsko', hex: 'DZA'},
            {value: 6, label: 'Andorra', hex: 'AND'},
            {value: 7, label: 'Angola', hex: 'AGO'}
        ];
    }
}
