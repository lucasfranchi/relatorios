import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import * as ExcelJS from 'exceljs';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  saveOutline
} from 'ionicons/icons';
import { ChangeExcelFileDTO } from 'src/app/services/change-excel-file/change-excel-file';
import {
  getLinkedForms,
  getReportIdsForms,
} from 'src/app/services/form-organizer/form-organizer';
import { FormOrganizerService } from 'src/app/services/form-organizer/form-organizer.service';
import { NormaxColorCardsInterface } from '../../../../components/normax-color-cards/normax-color-cards';
import { NormaxColorCardsComponent } from '../../../../components/normax-color-cards/normax-color-cards.component';
import { NormaxIconButtonComponent } from '../../../../components/normax-icon-button/normax-icon-button.component';
import { NormaxLoadingComponent } from '../../../../components/normax-loading/normax-loading.component';
import { ChangeExcelFileService } from '../../../../services/change-excel-file/change-excel-file.service';
import { ReportOrganizerService } from '../../../../services/report-organizer/report-organizer.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  imports: [
    IonIcon,
    CommonModule,
    NormaxColorCardsComponent,
    IonCol,
    IonGrid,
    IonRow,
    NormaxLoadingComponent,
    NormaxIconButtonComponent,
  ],
  standalone: true,
})
export class ReportListComponent implements OnInit {
  isLoading: boolean = false;

  cardsOptions: Array<NormaxColorCardsInterface> = [
    {
      color: '193,121,71',
      title: 'ARRANJO FÍSICO E INSTALAÇÕES - NR-12',
      id: 1,
    },
    {
      color: '232,100,100',
      title: 'INSTALAÇÕES E DISPOSITIVOS ELÉTRICOS - NR-12',
      id: 2,
    },
    {
      color: '80,204,136',
      title: 'DISPOSITIVOS DE PARADA E PARTIDA - NR-12',
      id: 3,
    },
    {
      color: '94,149,188',
      title: 'SISTEMAS DE SEGURANÇA - NR-12',
      id: 4,
    },
    {
      color: '216,190,95',
      title: 'DISPOSITIVOS DE PARADA DE EMERGÊNCIA - NR-12',
      id: 5,
    },
    {
      color: '195,170,87',
      title: 'COMPONENTES PRESSURIZADOS - NR-12',
      id: 6,
    },
    {
      color: '129,77,168',
      title: 'TRANSPORTADORES DE MATERIAIS - NR-12',
      id: 7,
    },
    {
      color: '155,194,230',
      title: 'ASPECTOS ERGONÔMICOS - NR-12',
      id: 8,
    },
    {
      color: '0,32,96',
      title: 'RISCOS ADICIONAIS - NR-12',
      id: 9,
    },
    {
      color: '192,0,0',
      title: 'MANUTENÇÃO, INSPEÇÃO, AJUSTE E REPAROS - NR-12',
      id: 10,
    },
    {
      color: '82,82,82',
      title: 'SINALIZAÇÃO - NR-12',
      id: 11,
    },
    {
      color: '32,55,100',
      title: 'MANUAIS - NR-12',
      id: 12,
    },
    {
      color: '181,152,65',
      title: 'PROCEDIMENTOS - NR-12',
      id: 13,
    },
    {
      color: '133,155,177',
      title: 'CAPACITAÇÃO - NR-12',
      id: 14,
    },
    {
      color: '64,64,64',
      title: 'REQUISITOS ESPECÍFICOS DE SEGURANÇA - NR-12',
      id: 15,
    },
    {
      color: '181,127,88',
      title: 'DISPOSIÇÕES FINAIS - NR-12',
      id: 16,
    },
    {
      color: '0,0,0',
      title: 'ANEXO III da NR-12 MEIOS DE ACESSO A MÁQUINAS E EQUIPAMENTOS',
      id: 17,
    },
  ];

  reports: Array<NormaxColorCardsInterface> = [];

  constructor(
    private _router: Router,
    private _reportOrganizerService: ReportOrganizerService,
    private _formOrganizerService: FormOrganizerService,
    private _changeExcelFileService: ChangeExcelFileService,
    private _location: Location,
    private _http: HttpClient
  ) {
    addIcons({ arrowBackOutline, saveOutline });
  }

  ngOnInit(): void {
    const arr = [];
    this._reportOrganizerService
      .getReports()
      .forEach((it) =>
        arr.push(this.cardsOptions.find((card) => card.id === it.id))
      );
    this.reports = arr;
  }

  public addItemInReport(card: NormaxColorCardsInterface) {
    this._router.navigate(['/responder-formulario/apreciacao-risco'], {
      queryParams: {
        id: card.id,
      },
    });
  }

  public deleteItemInReport(card: NormaxColorCardsInterface) {
    this.cardsOptions.find((option) => option.id === card.id).hasInReport =
      false;
    this.reports = this.reports.filter((report) => report.id !== card.id);
    this._reportOrganizerService.removeReport(card.id);
  }

  public async gerarRelatorio() {
    try {
      this.isLoading = true;
      const formOrganizer = this._formOrganizerService.getFormValue();

      this._formOrganizerService.addFormValues('capa', {
        maquina: formOrganizer?.apresentacaoMaquina?.maquina,
        serie: formOrganizer?.apresentacaoMaquina?.numTagSeri,
        localInstalacao: formOrganizer?.apresentacaoMaquina?.localInstalacao,
        valorMedia: this._reportOrganizerService.getMedia().toString(),
      });

      console.log(this._reportOrganizerService.getMedia().toString())

      const updatedForm = this._formOrganizerService.getFormValue();

      Object.keys(updatedForm).forEach((it) => {
        this._http
          .get('/assets/NR-12/NR-12.xlsx', { responseType: 'blob' })
          .subscribe((data) => {
            const file = new File([data], 'NR-12.xlsx', { type: data.type });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            const changeExcelFileDTO: ChangeExcelFileDTO = {
              changesList: getLinkedForms(it, updatedForm),
              file: dataTransfer,
              reportId: getReportIdsForms(it),
            };
            this._changeExcelFileService.changeExcelFile(changeExcelFileDTO);
          });
      });
      setTimeout(() => {
        this._changeExcelFileService.changeOrdersAndGenerateReports();
      }, 3000);
    } catch (error) {
      this.isLoading = false;
      console.error('Erro ao gerar relatório:', error);
    }
  }

  public returnPage(): void {
    this._location.back();
  }
}
