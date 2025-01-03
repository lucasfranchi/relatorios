import { Component, OnInit, ViewChild } from '@angular/core';
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
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, helpCircleOutline } from 'ionicons/icons';
import { ChangeExcelFileDTO } from 'src/app/services/change-excel-file/change-excel-file';
import { ChangeExcelFileService } from 'src/app/services/change-excel-file/change-excel-file.service';
import { getCellChangesByForm } from './apreciacao-risco';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rl-apreciacao-risco',
  templateUrl: './apreciacao-risco.component.html',
  styleUrls: ['./apreciacao-risco.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class ApreciacaoRiscoComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  formGroup: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _changeExcelFileService: ChangeExcelFileService,
    private _http: HttpClient
  ) {
    addIcons({ helpCircleOutline, arrowBackOutline });
  }

  ngOnInit() {
    this._createFormGroup();
  }

  private _createFormGroup() {
    this.formGroup = this._fb.group({
      relatorio: ['0', [Validators.required]],
      perigo: [],
      localizacao: [],
      atividade: [],
      consequenciaRisco: [],
      tipo: [],
      avaliacaoRisco: [],
      estimativaRisco: [],
      reducaoRiscoPerc: [],
      consideracaoCondAtual: [""],
      recomendacoes: [""],
    });
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

  public generateRelatorio() {
    this._http.get('/assets/NR-12.xlsx', { responseType: 'blob' }).subscribe(data => {
      const file = new File([data], 'NR-12.xlsx', { type: data.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const changeExcelFileDTO: ChangeExcelFileDTO = {
        changesList: Object.keys(this.formGroup.value)
          .filter((it) => getCellChangesByForm(this.formGroup.value, it))
          .map((key) => getCellChangesByForm(this.formGroup.value, key)),
        file: dataTransfer
      };
      this._changeExcelFileService.changeExcelFile(changeExcelFileDTO);
    })
  }

  onWillDismiss(event: Event) {}
}
