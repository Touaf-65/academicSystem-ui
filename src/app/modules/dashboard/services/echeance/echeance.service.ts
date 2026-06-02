import { Injectable } from '@angular/core';

export interface EcheanceModel {
  id: number;
  titre: string;
  description: string;
  date_limite: Date;
  statut: 'A venir' | 'Fait' | 'En retard';
}

export interface CreateEcheanceRequest {
  titre: string;
  description: string;
  date_limite: Date;
  statut: 'A venir' | 'Fait' | 'En retard';
}

@Injectable({
  providedIn: 'root',
})

export class EcheanceService {

}
