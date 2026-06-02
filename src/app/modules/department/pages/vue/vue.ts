import { Component, OnInit } from '@angular/core';
import { PieChartComponent } from '../../../common/charts/pie-chart/pie-chart';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [PieChartComponent, ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  departments: any[] = [];

  loadDepartments() {
    this.departments = [
      {
        id: 1,
        nom: 'Informatique',
        code: 'IFN',
        description: "Département des nouvelles technologies de l'information",
      },
      {
        id: 2,
        nom: 'Economie de Gestion',
        code: 'EG',
        description: "Département d'étude des métiers de l'économie'",
      },
    ];
  }

  // --->Create<---
  modalCreateOpen = false;
  openModalCreateDepartment() {
    this.modalCreateOpen = true;
  }

  closeModalCreateDepartment() {
    this.modalCreateOpen = false;
  }

  confirmCreateDepartment() {
    const payload = {};

    this.notificationService.success(
      'Département créée',
      'Le nouveau département crée avec succès!',
    );
    this.closeModalCreateDepartment();
  }

  // --->View<---
  modalViewOpen = false;
  openModalViewDepartment() {
    this.modalViewOpen = true;
  }

  closeModalViewDepartment() {
    this.modalViewOpen = false;
  }

  // --->Edit<---
  modalEditOpen = false;
  departmentToEdit: any = null;
  editError = '';

  openModalEditDepartment() {
    this.openEditDepartment(this.departmentToEdit);
  }

  openEditDepartment(department: any) {
    this.modalEditOpen = true;
    this.departmentToEdit = department;
    this.editError = '';
  }

  closeModalEditDepartment() {
    this.modalEditOpen = false;
    this.departmentToEdit = null;
    this.deleteError = '';
  }

  confirmEditDepartment() {
    if (!this.departmentToEdit) return;

    this.notificationService.success(
      'Département mis à jour',
      'La mise à jour du département a été effectuée avec succès!',
    );
    this.closeModalEditDepartment();
  }

  // --->Delete<---
  modalDeleteOpen = false;
  departmentToDelete: any = null;
  deleteError = '';

  openModalDeleteDepartment() {
    this.openDeleteDepartment(this.departmentToDelete);
  }

  openDeleteDepartment(department: any) {
    this.modalDeleteOpen = true;
    this.departmentToDelete = department;
    this.deleteError = '';
  }

  closeModalDeleteDepartment() {
    this.modalDeleteOpen = false;
    this.departmentToDelete = null;
    this.deleteError = '';
  }

  confirmDeleteDepartment() {
    if (!this.departmentToDelete) return;

    this.notificationService.success(
      'Département supprimé',
      'Le département a été supprimé avec succès!',
    );
    this.closeModalDeleteDepartment();
  }
}
