import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PdfService } from './services/pdf.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'notaria-x';
  form: FormGroup;

  constructor(private fb: FormBuilder, private pdfService: PdfService) {
    this.form = this.fb.group({
      motor: [''],
      chasis: [''],
      marca: [''],
      modelo: [''],
      anio: [''],
      color: [''],
    });

  }
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.pdfService.uploadPdf(file).subscribe(response => {
      const extractedText = response.text;
      this.fillForm(extractedText);
    });
  }

  fillForm(text: string) {
    console.log('Extracted Text:', text);

    this.form.patchValue({
      motor: this.extractValue(text, /Número de motor:\s*([\w\d-]+)/i),
      chasis: this.extractValue(text, /Número de chasis:\s*([\w\d-]+)/i),
      marca: this.extractValue(text, /Marca del vehículo:\s*(\w+)/i),
      modelo: this.extractValue(text, /Modelo del vehículo:\s*(\w+)/i),
      anio: this.extractValue(text, /Año de fabricación:\s*(\d{4})/i),
      color: this.extractValue(text, /Color:\s*(\w+)/i),
    });
  }

  extractValue(text: string, regex: RegExp): string {
    const match = text.match(regex);
    return match ? match[1] : '';
  }
}
