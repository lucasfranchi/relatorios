import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, helpCircleOutline } from 'ionicons/icons';
import 'jspdf-autotable';
import { SistemaGerstaoQualidadeItem } from './sistema-gestao-qualidade';
import { Router } from '@angular/router';

@Component({
  selector: 'sistema-gestao-qualidade',
  templateUrl: './sistema-gestao-qualidade.component.html',
  styleUrls: ['./sistema-gestao-qualidade.component.scss'],
  imports: [
    CommonModule,
    IonInput,
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    ReactiveFormsModule,
    FormsModule,
  ],
  standalone: true,
})
export class SistemaGestaoQualidadeComponent implements OnInit {
  formGroup: FormGroup;
  items: Array<SistemaGerstaoQualidadeItem> = [];
  newItem: SistemaGerstaoQualidadeItem = {
    rev: 0,
    data: '',
    alteracoes: '',
    revisadoPor: '',
  };
  isModalOpen: boolean = false;
  isValidForm: boolean = false;

  constructor(private _fb: FormBuilder, private _router: Router) {
    addIcons({ helpCircleOutline, arrowBackOutline });
  }

  ngOnInit() {
    this._createFormGroup();

    this.formGroup.valueChanges.subscribe((it) => {
      this.isValidForm = this.formGroup.valid;
    });
  }

  private _createFormGroup() {
    this.formGroup = this._fb.group({
      documento: ['', [Validators.required]],
      elaboracaoInicial: ['', [Validators.required]],
      leituraCritica: ['', [Validators.required]],
      aprovacao: ['', [Validators.required]],
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addRegistro() {
    this.items.push({ ...this.newItem });
    console.log(this.newItem);
    this.newItem = {
      rev: this.newItem.rev++,
      data: '',
      alteracoes: '',
      revisadoPor: '',
    };
    this.closeModal();
  }

  public nextPage() {
    this._router.navigate(['/responder-formulario/identificacoes']);
  }
}
