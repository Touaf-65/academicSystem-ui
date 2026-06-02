import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-program',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './program.html',
  styleUrl: './program.scss',
})
export class Program implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadPrograms();
  }

  programs: any[] = [];

  loadPrograms() {
    this.programs = [
      {
        id: 1,
        nom: 'Génie Logiciel',
        code: 'GL',
        cycle: 'Licence, Master',
      },
      {
        id: 2,
        nom: 'Administration Système & Réseaux',
        code: 'ASR',
        cycle: 'Master',
      },
    ];
  }

  // --->Create<---
  modalCreateOpen = false;
  openModalCreateProgram() {
    this.modalCreateOpen = true;
  }

  closeModalCreateProgram() {
    this.modalCreateOpen = false;
  }

  confirmCreateProgram() {
    const payload = {};

    this.notificationService.success(
      'Département créée',
      'Le nouveau département crée avec succès!',
    );
    this.closeModalCreateProgram();
  }

  // --->View<---
  modalViewOpen = false;
  openModalViewProgram() {
    this.modalViewOpen = true;
  }

  closeModalViewProgram() {
    this.modalViewOpen = false;
  }

  // --->Edit<---
  modalEditOpen = false;
  departmentToEdit: any = null;
  editError = '';

  openModalEditProgram() {
    this.openEditProgram(this.departmentToEdit);
  }

  openEditProgram(department: any) {
    this.modalEditOpen = true;
    this.departmentToEdit = department;
    this.editError = '';
  }

  closeModalEditProgram() {
    this.modalEditOpen = false;
    this.departmentToEdit = null;
    this.deleteError = '';
  }

  confirmEditProgram() {
    if (!this.departmentToEdit) return;

    this.notificationService.success(
      'Département mis à jour',
      'La mise à jour du département a été effectuée avec succès!',
    );
    this.closeModalEditProgram();
  }

  // --->Delete<---
  modalDeleteOpen = false;
  departmentToDelete: any = null;
  deleteError = '';

  openModalDeleteProgram() {
    this.openDeleteProgram(this.departmentToDelete);
  }

  openDeleteProgram(department: any) {
    this.modalDeleteOpen = true;
    this.departmentToDelete = department;
    this.deleteError = '';
  }

  closeModalDeleteProgram() {
    this.modalDeleteOpen = false;
    this.departmentToDelete = null;
    this.deleteError = '';
  }

  confirmDeleteProgram() {
    if (!this.departmentToDelete) return;

    this.notificationService.success(
      'Département supprimé',
      'Le département a été supprimé avec succès!',
    );
    this.closeModalDeleteProgram();
  }
}
