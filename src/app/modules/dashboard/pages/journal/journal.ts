import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

@Component({
  standalone: true,
  selector: 'app-journal',
  imports: [CommonModule, ModalComponent, NotificationComponent],
  templateUrl: './journal.html',
  styleUrl: './journal.scss',
})
export class Journal implements OnInit {

  constructor(private notificationService: NotificationService) { }

  journaux: any[] = [];

  ngOnInit() {
    this.loadJournaux();
  }

  loadJournaux() {
    this.journaux = [
      {
        id: 1,
        title: 'Semaine 1 – Prise en main du projet',
        description: 'Installation de l’environnement et compréhension de l’architecture globale.',
        content: 'Durant cette première semaine, j’ai mis en place Angular, configuré le backend et analysé les besoins du projet StageBoard...',
        date: new Date(2024, 4, 6)
      },
      {
        id: 2,
        title: 'Semaine 2 – Authentification',
        description: 'Mise en place du système de login et gestion des rôles utilisateurs.',
        content: 'J’ai implémenté un système d’authentification basé sur JWT avec gestion des rôles ADMIN, SUPERUSER...',
        date: new Date(2024, 4, 13)
      },
      {
        id: 3,
        title: 'Semaine 3 – Gestion des pays',
        description: 'CRUD complet des pays avec modal réutilisable.',
        content: 'Création d’un composant modal réutilisable permettant l’ajout, la modification et la suppression des pays...',
        date: new Date(2024, 4, 20)
      },
      {
        id: 4,
        title: 'Semaine 4 – Échéances',
        description: 'Implémentation du module de gestion des échéances.',
        content: 'Ajout des fonctionnalités de création, édition et suppression des échéances avec filtres par statut...',
        date: new Date(2024, 4, 27)
      },
      {
        id: 5,
        title: 'Semaine 5 – Journal de bord',
        description: 'Mise en place du module journal avec affichage dynamique.',
        content: 'Développement du module journal permettant de consigner les activités hebdomadaires...',
        date: new Date(2024, 5, 3)
      }
    ];
  }

  modalCreateOpen = false;
  modalViewOpen = false;

  selectedJournal: any = null;

  form = {
    title: '',
    week: '',
    description: '',
    date: ''
  };

  openCreateModal() {
    this.modalCreateOpen = true;
  }

  closeCreateModal() {
    this.modalCreateOpen = false;

    this.form = {
      title: '',
      week: '',
      description: '',
      date: ''
    };
  }

  openView(j: any) {
    this.selectedJournal = j;
    this.modalViewOpen = true;
  }

  closeView() {
    this.modalViewOpen = false;
    this.selectedJournal = null;
  }
}

