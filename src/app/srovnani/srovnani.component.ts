import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { LOGO_200x100 } from '../../assets/params/loga';
import { trigger, transition, style, animate, keyframes, query, stagger, animateChild } from '@angular/animations';
/*
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfSrovnani from '../_pdf-templates/srovnani';
*/

@Component({
    selector: 'app-srovnani',
    templateUrl: './srovnani.component.html',
    styleUrls: ['./srovnani.component.css'],
    animations: [
        trigger('items', [
          transition('void => *', [
            animate(300, keyframes([
              style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
              style({opacity: 1, transform: 'translateX(15px)', offset: 0.2}),
              style({opacity: 1, transform: 'translateX(0)', offset: 0.8})
            ]))
          ]),
          transition('* => void', [
            animate(300, keyframes([
              style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
              style({opacity: 1, transform: 'translateX(-15px)', offset: 0.6}),
              style({opacity: 0, transform: 'translateX(100%)',  offset: 0.8})
            ]))
          ]),
        ]),
        trigger('list', [
          transition(':enter', [
            query('@items', stagger(150, animateChild()), { optional: true })
          ]),
        ])
    ]
})
export class SrovnaniComponent implements OnInit {
    @Input() offers;
    @Input() filters;
    @Input() nvoffers;
    @Input() data;
    @Input() layout;
    @Input() staticTabs;
    LOGA = LOGO_200x100;

    constructor() {
        // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    public openPDF(): void {
        // const dd = pdfSrovnani.srovnani(this.offers);
        // pdfMake.createPdf(dd).download('nabídky - ' + '.pdf');
    }

    partneriVse(ev): void {
        this.filters.partneri.forEach(x => this.filters.partnobj[x] = true);
    }

    priprav_data(): void {
    }

    nastavSlevy(offer): void {
        const pos = offer.slevyZaProdukty.indexOf('%');
        const ns = offer.slevyZaProdukty.substring(0, pos).replace(' ', '').replace(',', '.');
        // console.log( ns );
        this.layout.kontakt_text = '<div class="card mt-2"><div class="card-body row align-items-center">'+
            '<div class="col-2"><img src="' + this.LOGA[offer.nazev] + '" class="img-fluid" alt="' + this.LOGA[offer.nazev] + '" /></div>' +
            '<div class="col-10">Slevu na úrokové sazbě až ' + offer.slevy +
            ' lze získat po úspěšném skoringu. Bezproblémový skoring vám zaručí maximální možnou výši slevy.';
        this.layout.kontakt_text += (ns > 0 ? ' Též můžete získat slevu až ' + offer.slevyZaProdukty + '.' : '');
        this.layout.kontakt_text += '</div></div></div>';
    }

    ngOnInit() {

    }

}
