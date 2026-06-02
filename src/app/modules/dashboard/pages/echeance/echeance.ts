import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EcheanceModel, EcheanceService } from '../../services/echeance/echeance.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  standalone: true,
  selector: 'app-echeance',
  imports: [CommonModule, ModalComponent, FormsModule, NotificationComponent],
  templateUrl: './echeance.html',
  styleUrl: './echeance.scss',
})
export class Echeance implements OnInit {

  constructor(private notificationService: NotificationService) { }

  titre: string = '';
  description: string = '';
  date_limite: string = '';
  statut: string = 'A venir';

  echeances: EcheanceModel[] = [];

  // selected item
  selected: any = null;


  ngOnInit() {
    this.loadEcheances();
  }

  loadEcheances() {
    // mock temporaire
    this.echeances = [
      {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'A venir'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'A venir'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'En retard'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'Fait'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'A venir'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'Fait'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'Fait'
      }, {
        id: 1,
        titre: 'Rapport intermédiaire',
        description: 'Remise du rapport intermédiaire',
        date_limite: new Date(),
        statut: 'En retard'
      },
    ];
  }

  // ===== CREATE =====
  modalCreateOpen = false;
  openModalCreateEcheance() {
    this.modalCreateOpen = true;
  }

  closeModalCreateEcheance() {
    this.modalCreateOpen = false;
  }

  confirmCreateEcheance() {
    const payload = {
      titre: this.titre,
      description: this.description,
      date_limite: this.date_limite,
      statut: this.statut
    };

    this.notificationService.success('Échéance créée', 'La nouvelle échéance a été créée avec succès!');
    this.closeModalCreateEcheance();
  }

  // Fin Modal create

  // ===== EDIT =====
  echeanceToEdit: EcheanceModel | null = null;
  editDate: Date = new Date();
  editTitre: string = '';
  editDescription: string = '';
  editStatut: 'A venir' | 'Fait' | 'En retard' = 'A venir';
  modalEditOpen = false;

  openEdit(echeance: EcheanceModel) {
    this.modalEditOpen = true;
    this.echeanceToEdit = echeance;
    this.editTitre = echeance.titre;
    this.editDescription = echeance.description;
    this.editDate = echeance.date_limite;
    this.editStatut = echeance.statut;
  }

  closeModalEditEcheance() {
    this.modalEditOpen = false;
    this.echeanceToEdit = null;
    this.editTitre = '';
    this.editDescription = '';
    this.editDate = new Date();
    this.editStatut = 'A venir';
  }

  confirmEditEcheance() {
    if (this.echeanceToEdit) {
      this.echeanceToEdit.titre = this.editTitre;
      this.echeanceToEdit.description = this.editDescription;
      this.echeanceToEdit.date_limite = this.editDate;
      this.echeanceToEdit.statut = this.editStatut;

      this.notificationService.success('Échéance modifiée', 'L\'échéance a été modifiée avec succès!');
      this.closeModalEditEcheance();
    }
  }

  // ===== DELETE =====
  modalDeleteOpen = false;
  echeanceToDelete: EcheanceModel | null = null;
  deleteError = '';

  OpenModalDeleteEcheance(echeance: EcheanceModel) {
    this.modalDeleteOpen = true;
    this.echeanceToDelete = echeance;
    this.deleteError = '';
  }

  closeModalDeleteEcheance() {
    this.modalDeleteOpen = false;
    this.echeanceToDelete = null;
    this.deleteError = '';
  }

confirmDeleteEcheance() {
  // if (!this.echeanceToDelete) return;

  this.notificationService.success('Echéance supprimée', "L'échéance a été supprimée avec succès!");
  this.closeModalDeleteEcheance();
}

  openDelete(e: any) {
    this.selected = e;
    this.modalDeleteOpen = true;
  }

  closeDelete() {
    this.modalDeleteOpen = false;
  }


  menuOpen = false;
  selectedEcheance: any = null;
  menuPosition = { x: 0, y: 0 };




  openDeleteEcheance(e: any) {
    this.selectedEcheance = e;

    this.modalDeleteOpen = true;
  }

  openMenu(event: MouseEvent, e: any) {
    event.stopPropagation();

    this.selectedEcheance = e;

    this.menuOpen = true;

    this.menuPosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onEditFromMenu() {
    this.closeMenu();
    this.openEdit(this.selectedEcheance);
  }

  onDeleteFromMenu() {
    this.closeMenu();
    this.openDeleteEcheance(this.selectedEcheance);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }
}
