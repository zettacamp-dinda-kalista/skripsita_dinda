import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
      providedIn: 'root'
})
export class DevTypeService {
      private readonly url = 'http://127.0.0.1:5000/api';

      constructor(
            private http: HttpClient
      ) { }

      getDevType(description: string): Observable<any> {
            return this.http.post<any>(this.url, { bug_description: description });
      }
}
