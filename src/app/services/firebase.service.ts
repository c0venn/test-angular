import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  updateData(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, updatedData);
  }

  deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
