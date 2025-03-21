import {
  ApresentacaoMaquinaForm,
  CapaForm,
  CategoriaForm,
  LimitesMaquinaForm,
} from '../form-organizer/form-organizer';
import { ReportOrganizerInterface } from '../report-organizer/report-organizer';

export interface NormaxStorageFormsInterface {
  apresentacaoMaquina?: ApresentacaoMaquinaForm;
  categoriaSeguranca?: CategoriaForm;
  capa?: CapaForm;
  limitesMaquina?: LimitesMaquinaForm;
  name: string;
  date: string;
  reportList: Array<ReportOrganizerInterface>;
}
export interface NormaxStorageInterface {
  id: string;
  data: NormaxStorageFormsInterface;
  isSelected: boolean;
}
