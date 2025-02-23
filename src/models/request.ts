export interface LaminaType {
  id: number;
  sheetId: number;
  length: number;
  weight: number;
  stock: number;
}

export interface Lamina {
  id: number;
  Model: string;
  width: number;
  thickness: number;
  weight: number;
  types: LaminaType[];
}

export interface result {
  message: string;
  response:
    | {
        volumenCarga: number;
        pesoCarga: number;
        camionesDisponibles: {
          camionId: number;
          modelo: string;
          volumenDisponible: number;
          pesoDisponible: number;
        }[];
        camionOptimo: {
          camionId: number;
          modelo: string;
          volumenCamion: number;
          PesoCamion: number;
          volumenOcupado: number;
          pesoOcupado: number;
          porcentajeOcupacion: number;
          volumenDisponible: number;
          pesoDisponible: number;
        };
      }
    | undefined;
}
