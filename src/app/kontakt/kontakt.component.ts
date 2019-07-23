import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
    selector: 'app-kontakt',
    templateUrl: './kontakt.component.html',
    styleUrls: ['./kontakt.component.css'],
    viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class KontaktComponent implements OnInit {
    @Input() data;
    @Input() submitted;
    @Input() layout;
    @Input() lists;

    constructor() { }

    ngOnInit() {
    }

}
