import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISrovnani, IItem, ISjednaniResp } from '../_interfaces/hypoteky';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class ParamsService {

    constructor(private http: HttpClient) { }

    getKalkulace(id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        const data = {'id': id};
        // console.log('id kalkulace ', data);
        return this.http.post('https://www.srovnavac.eu/api/hypoteky/app/kalkulace', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    KalkulaceEmail(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        console.log('kalkulace na email ', JSON.stringify(data) );
        return this.http.post('https://www.srovnavac.eu/api/hypoteky/app/emailkalk', data, httpOptions)
        .pipe(
            // catchError()
        );
    }

    getSrovnani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };

        return this.http.post<ISrovnani>('https://www.srovnavac.eu/api/hypoteky/app/srovnani', data, httpOptions)
        .pipe(
            // catchError(this.handleError('addHero', hero))
        );
    }

    ulozSjednani(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        // console.log(JSON.stringify(data));
        return this.http.post<ISjednaniResp>('https://www.srovnavac.eu/api/hypoteky/app/sjednani', data, httpOptions)
        .pipe(
            // catchError(this.handleError('addHero', hero))
        );
    }
}
