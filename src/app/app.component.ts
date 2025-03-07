import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PdfService } from './services/pdf.service';
import { FirebaseService } from './services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'notaria-x';
  myForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  data: any[] = [];
  updatedDocument = { motor: 'New Motor', chasis: 'New Chasis', marca: 'New Marca' };
  docId = 'someDocId';

  constructor(
    private fb: FormBuilder,
    private pdfService: PdfService,
    private firebaseService: FirebaseService
  ) {
    this.myForm = this.fb.group({
      motor: [''],
      chasis: [''],
      marca: [''],
      modelo: [''],
      anio: [''],
      color: [''],
    });
  }

  ngOnInit() {
    this.onGetAll();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.pdfService.uploadPdf(file).subscribe((response: any) => {
        setTimeout(() => {
          (document.getElementById('motor') as HTMLInputElement).value =
            response.text.motor || '';
          (document.getElementById('chasis') as HTMLInputElement).value =
            response.text.chasis || '';
          (document.getElementById('marca') as HTMLInputElement).value =
            response.text.marca || '';
          (document.getElementById('modelo') as HTMLInputElement).value =
            response.text.modelo || '';
          (document.getElementById('anio') as HTMLInputElement).value =
            response.text.anio || '';
          (document.getElementById('color') as HTMLInputElement).value =
            response.text.color || '';
          this.isLoading = false;
        }, 1000);
      });
    } else {
      this.isLoading = false;
      alert('No hay archivo seleccionado');
    }
  }
  async saveData(event: any) {
    event.preventDefault();
    const formData = {
      motor: (document.getElementById('motor') as HTMLInputElement).value,
      chasis: (document.getElementById('chasis') as HTMLInputElement).value,
      marca: (document.getElementById('marca') as HTMLInputElement).value,
      modelo: (document.getElementById('modelo') as HTMLInputElement).value,
      año: (document.getElementById('anio') as HTMLInputElement).value,
      color: (document.getElementById('color') as HTMLInputElement).value,
    };

    if (
      !formData.motor ||
      !formData.chasis ||
      !formData.marca ||
      !formData.modelo ||
      !formData.año ||
      !formData.color
    ) {
      this.errorMessage = 'Todos los campos son requeridos';
      return;
    }

    this.isLoading = true;
    this.pdfService.saveData(formData, event).subscribe((response) => {
      setTimeout(() => {
        this.isLoading = false;
        console.log('Datos guardados', response);
      }, 1000);
      alert('Datos guardados correctamente');
    });
  }

  onGetAll() {
    this.firebaseService.getAllData().subscribe((response) => {
      console.log('All Data:', response);
      this.data = response.data;
    });
  }

  onEdit() {
    this.firebaseService
      .updateData(this.docId, this.updatedDocument)
      .subscribe((response) => {
        console.log('Data updated:', response);
      });
  }

  onDelete() {
    this.firebaseService.deleteData(this.docId).subscribe((response) => {
      console.log('Data deleted:', response);
    });
  }
}
