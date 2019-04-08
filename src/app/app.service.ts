import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = environment.url;
  constructor(public http: HttpClient) { }

  getCombo(tipo: String) {
    const url = `${this.url}/combo/${tipo}`;       
    
    return this.http.get(url, {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    });
  }
}
