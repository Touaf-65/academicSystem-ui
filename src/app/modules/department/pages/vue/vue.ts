import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PieChartComponent } from '../../../common/charts/pie-chart/pie-chart';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentModel, DepartmentService } from '../../services/department/department-service';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [PieChartComponent, ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  code: string = '';
  nom: string = '';
  description: string = '';

  departments: DepartmentModel[] = [];
  filteredDepartments: DepartmentModel[] = [];

  selected: any = null;

  departmentToEdit: DepartmentModel | null = null;
  departmentToDelete: DepartmentModel | null = null;

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments(): void {
    const token = localStorage.getItem('authToken');
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.filteredDepartments = data;
        this.cdr.detectChanges();
      },
    });
  }

  createDepartment(): void {
    const departmentLoad = {
      code: this.code,
      description: this.description,
      nom: this.nom,
    };
    this.departmentService.createDepartment(departmentLoad).subscribe({
      next: (data) => {
        this.notificationService.success(
          'Département créée',
          'La nouvelle département a été créé avec succès!',
        );
        this.code = '';
        this.description = '';
        this.nom = '';
        this.loadDepartments();
        this.modalCreateOpen = false;
      },
      error: (error) => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du département.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editDepartment(): void {
    const payload = {
      code: this.editCode,
      description: this.editDescription,
      nom: this.editNom,
    };
    this.departmentService.updateDepartment(this.departmentToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Département modifié',
          'Le département a été modifié avec succès!',
        );
        this.loadDepartments();
        this.closeModalEditDepartment();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du département.',
        );
        this.closeModalEditDepartment();
      },
    });
  }

  deleteDepartment(): void {
    this.departmentService.deleteDepartment(this.departmentToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Département supprimé',
          'Le département a été supprimé avec succès!',
        );
        this.loadDepartments();
        this.closeModalDeleteDepartment();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du département.',
        );
        this.closeModalDeleteDepartment();
      },
    });
  }

  // --->Create<---
  modalCreateOpen = false;
  openModalCreateDepartment() {
    this.modalCreateOpen = true;
  }

  closeModalCreateDepartment() {
    this.modalCreateOpen = false;
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
  editCode: string = '';
  editNom: string = '';
  editDescription: string = '';
  editError = '';


  openEditDepartment(department: DepartmentModel) {
    this.modalEditOpen = true;
    this.departmentToEdit = department;
    this.editCode = department.code;
    this.editNom = department.nom;
    this.editDescription = department.description;
    this.editError = '';
  }

  closeModalEditDepartment() {
    this.modalEditOpen = false;
    this.departmentToEdit = null;
    this.editCode = '';
    this.editNom = '';
    this.editDescription = '';
    this.deleteError = '';
  }

  // --->Delete<---
  modalDeleteOpen = false;
  deleteError = '';

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

}
