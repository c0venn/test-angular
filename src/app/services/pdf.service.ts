import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  uploadPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<{
        motor: string;
        chasis: string;
        marca: string;
        modelo: string;
        anio: string;
        color: string;
      }>(this.apiUrl + 'pdf/extract', formData);
  }

  saveData(data: any, event: Event): Observable<any> {
    event.preventDefault();
    return this.http.post(this.apiUrl + 'save', data);
  }
}
