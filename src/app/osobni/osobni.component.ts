import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
    selector: 'app-osobni',
    templateUrl: './osobni.component.html',
    styleUrls: ['./osobni.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class OsobniComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() lists;

    constructor() {
    }

    pridatZadatele(): void {
        const i = this.data.Zadatele.length + 1;
        const zadatel = {
            RokNarozeni: null,
            Prijmy: null,
            Vydaje: null
        };
        if (i <= 5 ) { this.data.Zadatele.push(zadatel); }
        // console.log('zadatele: ', this.data.Zadatele);
    }

    smazZadatele(i: number): void {
        this.data.Zadatele.splice(i, 1);
    }

    pridatDite(): void {
        const i = this.data.RokNarozeniDeti.length + 1;
        if (i <= 6 ) { this.data.RokNarozeniDeti.push({}); }
        // console.log('deti: ', this.data.RokNarozeniDeti);
    }

    smazDite(i: number): void {
        this.data.RokNarozeniDeti.splice(i, 1);
    }

    ngOnInit() {
        if ( !this.data.Zadatele.length ) { this.pridatZadatele(); }
    }

}
