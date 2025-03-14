import { Injectable } from '@angular/core';
import { FormOrganizerInterface } from './form-organizer';
import { ImageSelectorInterface } from 'src/app/pages/formularios/nr-12/apreciacao-risco/apreciacao-risco';

@Injectable({
  providedIn: 'root',
})
export class FormOrganizerService {
  private forms?: FormOrganizerInterface = {
    apresentacaoMaquina: null,
    categoriaSeguranca: {
      categoriaF: 'F1',
      categoriaP: 'P1',
      categoriaS: 'S1',
    },
    limitesMaquina: null,
    capa: null,
  };

  private imageCapa?: ImageSelectorInterface = null;

  constructor() {}

  public addFormValues(
    key:
      | 'apresentacaoMaquina'
      | 'categoriaSeguranca'
      | 'limitesMaquina'
      | 'capa',
    formValue: any
  ) {
    this.forms[key] = formValue;
  }

  public getFormValue() {
    return this.forms;
  }

  public addCapaPhoto(imageSelector: ImageSelectorInterface) {
    this.imageCapa = imageSelector;
  }

  public getImageCapa() {
    return this.imageCapa;
  }
}
