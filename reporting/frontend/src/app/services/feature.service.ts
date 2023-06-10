import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeatureService {
    private readonly API_URL = 'http://localhost:8080';

    constructor(
        private http: HttpClient
    ) { }

    getOne(id: string) {
        return this.http.get(this.API_URL + '/feature/' + id);
    }

    getAll() {
        return this.http.get(this.API_URL + '/feature');
    }

    create(data: any) {
        return this.http.post(this.API_URL + '/feature', data);
    }

    update(id: string, data: any) {
        return this.http.put(this.API_URL + '/feature/' + id, data);
    }

    delete(id: string) {
        return this.http.delete(this.API_URL + '/feature/' + id);
    }
}
