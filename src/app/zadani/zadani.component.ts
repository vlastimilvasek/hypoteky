import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

// Data and Service
// import { IOption } from 'ng-select';

@Component({
    selector: 'app-zadani',
    templateUrl: './zadani.component.html',
    styleUrls: ['./zadani.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ZadaniComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;

    @ViewChild('zadani', { static: true }) poj_input: any;

    constructor(private scrollService: ScrollToService) { }

    public vyberNova(): void {
        this.submitted = false;
        this.data.Ucel = '3';
        const config: ScrollToConfigOptions = {
            target: 'start',
            duration: 300,
            offset: -120
        };
        // this.scrollService.scrollTo(config);
        setTimeout(() =>  {
            // this.poj_input.nativeElement.form[3].focus();
            // this.poj_input.nativeElement.form[3].blur();
        }, 100);
    }

    public vyberRefi(): void {
        this.submitted = false;
        this.data.Ucel = '5';
    }

    public vyberAmer(): void {
        this.submitted = false;
        this.data.Ucel = '9';
    }


    ngOnInit() {
    }
}
