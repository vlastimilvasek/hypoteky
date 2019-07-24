import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LOGO_200x100 } from '../assets/params/loga';

// Data and Service
import { ISrovnani } from './_interfaces/odpovednost';
import { ParamsService } from './_services/params.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'app-main',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ ParamsService ]
})
export class AppComponent implements OnInit {
    lists = {
      ucel: [
          { value: '1', label : 'Koupě zkolaudované nemovitosti' },
          { value: '2', label : 'Koupě rozestavěné nemovitosti' },
          { value: '3', label : 'Výstavba' },
          { value: '4', label : 'Rekonstrukce' },
          { value: '5', label : 'Refinancování' },
          { value: '6', label : 'Pořízení nem.v družstevním vlastnictví' },
          { value: '7', label : 'Koupě výnosové nem. (na pronájem)' },
          { value: '8', label : 'Vypořádání majetk.poměrů' },
          { value: '9', label : 'Bez účelu' }
      ],
      zastava_typ: [
          { value: '1', label: 'Rozestavěný byt v OV' },
          { value: '2', label: 'Zkolaudovaný byt v OV' },
          { value: '3', label: 'RD nezkolaudované' },
          { value: '4', label: 'RD zkolaudované' },
          { value: '5', label: 'Stavební parcela' },
          { value: '6', label: 'Rekreační objekt' },
          { value: '7', label: 'Bytový dům' },
          { value: '8', label: 'Komerční objekt' },
          { value: '9', label: 'Ručitel' },
      ],
    };

    LOGA = LOGO_200x100;
    URL = { 'adresa' : '' };
    data: any;
    srovnani: ISrovnani;
    translate: TranslateService;
    offers = [];
    nvoffers = [];
    filters;
    layouthelper = 'none';
    layout = {
        grid: {
            'z_label' : 'col-sm-5 col-md-4 offset-md-1 col-lg-2 offset-lg-3',
            'z_input' : 'col-sm-7 col-md-6 col-lg-4',
            'z_offset' : 'offset-sm-5',
            'column3' : 'col-12 col-md-4',
            'label3' : 'col-5 col-md-12',
            'input3' : 'col-7 col-md-12',
            'offset3' : 'offset-5 offset-md-0',
            'label4' : 'col-12',
            'input4' : 'col-8 col-md-10',
            'add4' : 'col-4 col-md-2',
            'offset4' : 'col',
            'column' : 'col-lg-6',
            'label' : 'col-sm-5',
            'input' : 'col-sm-7',
            'offset' : 'offset-sm-5',
            'column2_1' : 'col-lg-4',
            'column2_2' : 'col-lg-8',
            'label2_1' : 'col-lg-7 col-md-8 col-9',
            'input2_1' : 'col-lg-5 col-md-4 col-3',
            'label2' : 'col-lg-8 col-sm-5',
            'input2' : 'col-lg-4 col-sm-7',
        },
        table: true,
        kontakt_text: '',
        fixace: {1 : 'rok', 3 : 'roky', 5 : 'let' }
    };
    kalk_aktivni = false;
    mail_odeslan = false;
    amail_odeslan = false;
    @ViewChild('f', { static: true }) zadani_form: any;
    @ViewChild('u', { static: true }) udaje_form: any;
    @ViewChild('o', { static: true }) osobni_form: any;
    @ViewChild('kalk_email', { static: true }) email_form: any;
    @ViewChild('debugModal', { static: true }) debug_modal: any;
    @ViewChild('layoutHelper', { static: false }) layout_helper: any;
    @ViewChild('stepTabs', { static: true }) staticTabs: TabsetComponent;

    version = '1.1.0';
    aversion = require('../../package.json').version;

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // console.log(event.charCode);
        if (event.charCode === 272 || event.charCode === 240) { this.debug_modal.show(); }
        if (event.charCode === 248 || event.charCode === 321) { this.layouthelper = this.layouthelper === 'none' ? '' : 'none'; }
    }

    constructor(translate: TranslateService, private paramsService: ParamsService, private route: ActivatedRoute) {
        this.translate = translate;
        this.translate.addLangs(['cs', 'en']);
        this.translate.setDefaultLang('en');
        const lang = this.route.snapshot.queryParams['lang']  || 'cs';
        this.translate.use(lang);
    }

    KalkulaceEmail(form: any): void {
        if (form.valid) {
            this.GAEvent('HYP', 'Kalkulace', 'Zaslání na email', 1);
            if (this.data.id !== '' ) {
                this.data.link = this.URL.adresa;
                this.paramsService.KalkulaceEmail( this.data )
                .subscribe( resp => {
                    // console.log('poslat na email resp ', resp);
                    if (resp) {
                        this.mail_odeslan = true;
                    }
                });
            }
        }
    }

    GAEvent(cat: string, label: string, action: string, val: number): void {
        (<any>window).ga('send', 'event', {
            eventCategory: cat,
            eventLabel: label,
            eventAction: action,
            eventValue: val
        });
    }

    submitForm(form: any): void {
        if (form.valid) {
            this.kalkuluj();
            this.staticTabs.tabs[1].active = true;
        }
    }

    odeslatPoptavku(form: any): void {
        if (form.valid) {
            this.data.link = this.URL.adresa;
            this.paramsService.ulozSjednani(this.data)
                .subscribe( sjednani => {
                    // console.log('odeslatPoptavku - ulozSjednani', sjednani);
                    if ( sjednani.status === 'OK' ) { this.amail_odeslan = true; }
                });
        }
    }

    tabSrovnani(): void {
        // console.log('layout.kontakt_text: ', this.layout.kontakt_text);
        this.layout.kontakt_text = '';
        if (!this.offers.length && !this.kalk_aktivni && this.zadani_form.valid) {
            this.kalkuluj();
        }
    }

    kalkuluj(): void {
        this.kalk_aktivni = true;
        this.offers = [];
        this.nvoffers = [];
        this.paramsService.getSrovnani(this.data)
            // .map( (i) => { console.log('getSrovnani', i); return i; } )
            .subscribe( srovnani => {
                this.srovnani = srovnani;
                this.data.id = srovnani.id;
                this.URL.adresa = window.location.origin + window.location.pathname + '?id=' + srovnani.id;

                const items = [];
                const partneri = [];
                const partnobj = [];
                const platby = [];
                let jtext = '';
                this.srovnani.items.forEach( (x) => {
                    const params = [];
                    if ( partneri.indexOf(x.nazev) === -1 ) {
                        partneri.push( x.nazev );
                        jtext += `"${x}":"1"`;
                    }
                    items.push( Object.assign({}, x, {key: 'value' }) );
                });

                this.filters.partneri = partneri;
                // this.filters.partnobj = JSON.parse(`{"` + partneri.join(`":true,"`) + `":true}`);
                items.sort(function(a, b) { return a.efektivniUrok - b.efektivniUrok; });

                this.offers = items.filter( x => x.varovani === 'ok');
                this.nvoffers = items.filter( x => x.varovani !== 'ok');
                this.kalk_aktivni = false;
            });
    }


    initData(data: any): void {
        this.data = data || {
            id: '',
            pojisteni: this.route.snapshot.queryParams['pojisteni'] || 'HYP',
            Ucel: this.route.snapshot.queryParams['Ucel'] || null,
            Zamer: {
                Uver: this.route.snapshot.queryParams['Zamer.Uver'] || null,
                DobaSplaceni: this.route.snapshot.queryParams['Zamer.DobaSplaceni'] || 20,
                Fixace: this.route.snapshot.queryParams['Zamer.Fixace'] || 5,
                CelkovaInvestice: this.route.snapshot.queryParams['Zamer.CelkovaInvestice'] || null,
                VlastniProstredky: this.route.snapshot.queryParams['Zamer.VlastniProstredky'] || null,
            },
            TrvalyPobytCR: this.route.snapshot.queryParams['TrvalyPobytCR'] || 'true',
            ObcaneCR: this.route.snapshot.queryParams['ObcaneCR'] || 'true',
            PrijmyCR: this.route.snapshot.queryParams['PrijmyCR'] || 'true',
            NegativniZaznamRegistrDluzniku: this.route.snapshot.queryParams['NegativniZaznamRegistrDluzniku'] || 'false',
            Exekuce: this.route.snapshot.queryParams['Exekuce'] || 'false',
            Zastava: [{}],
            Zadatele: [{}],
            RokNarozeniDeti: [],
            poznamka: this.route.snapshot.queryParams['poznamka'] || '',
            promo_kod: this.route.snapshot.queryParams['promo_kod'] || '',
            ziskatel: this.route.snapshot.queryParams['ziskatel'] || 'srovnavac.cz',
            idkod: this.route.snapshot.queryParams['idkod'] || '',
            ipadr: ''
        };
        this.zadani_form.submitted = false;
    }

    ngOnInit() {
        console.log( 'verze: ', this.version + '@' + this.aversion );
        // console.log( 'data z URL : ', this.route.snapshot.queryParams['data'] );

        this.zadani_form.valueChanges.pipe(debounceTime(400)).subscribe(form => {
            form.submitted = false;
            // sessionStorage.setItem('zadani_form', JSON.stringify(form));
        });

        this.udaje_form.valueChanges.pipe(debounceTime(400)).subscribe(form => {
            // dopočítávání
            if (!this.data.Zamer.VlastniProstredky && (Number(this.data.Zamer.CelkovaInvestice) > Number(this.data.Zamer.Uver)) ) {
                this.data.Zamer.VlastniProstredky =  Number(this.data.Zamer.CelkovaInvestice) - Number(this.data.Zamer.Uver);
            }
            form.submitted = false;
        });

        this.email_form.valueChanges.pipe(debounceTime(200)).subscribe(form => {
            this.email_form.submitted = false;
            // sessionStorage.setItem('zadani_form', JSON.stringify(form));
        });

        this.filters = {};
        this.srovnani = {
            id: '',
            items: [],
            time: ''
        };
        let input_data = null;
        if (this.route.snapshot.queryParams['id'] !== undefined ) {
            this.paramsService.getKalkulace( this.route.snapshot.queryParams['id'] )
            .subscribe( data => {
                // console.log('data ', data);
                try {
                    input_data = data;
                    if (input_data.termin && input_data.termin.length > 1) {
                        const termin =  [ new Date(input_data.termin[0]), new Date(input_data.termin[1]) ];
                        input_data.termin = termin;
                    }
                    if (input_data.osoby && input_data.osoby.length > 0) {
                        const osoby = input_data.osoby;
                        input_data.osoby = [];
                        for (const os of osoby) {
                            if (os.vek) {
                                input_data.osoby.push(os);
                            }
                        }
                        input_data.pocet_osob = input_data.osoby.length;
                    }
                } catch (e) {
                    // console.log(e);
                }
                this.initData(input_data);
                setTimeout(() =>  {
                    // console.log('zadani_form form valid', this.zadani_form.form.valid );
                    if (this.zadani_form.valid) {
                        this.kalkuluj();
                        this.staticTabs.tabs[1].active = true;
                    }
                }, 50);
            });
        } else if (this.route.snapshot.queryParams['data'] !== undefined ) {
            // console.log('data snapshot', this.route.snapshot.queryParams['data'] );
            try {
                input_data = JSON.parse(this.route.snapshot.queryParams['data']);
            } catch (e) {
                // console.log(e);
            }
        }
        this.initData(input_data);
        // console.log('data ', JSON.parse(this.route.snapshot.queryParams['data']));
        // console.log('this.data ', this.data);
    }
}
