import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgramModel, ProgramService } from '../../services/program/program-service';
import { DepartmentModel, DepartmentService } from '../../services/department/department-service';

@Component({
  standalone: true,
  selector: 'app-program',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './program.html',
  styleUrl: './program.scss',
})
export class Program implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private programService: ProgramService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Champs création
  code: string = '';
  nom: string = '';
  departmentId: number | null = null;
  description: string = '';

  programs: ProgramModel[] = [];
  filteredPrograms: ProgramModel[] = [];
  departments: DepartmentModel[] = [];

  programToEdit: ProgramModel | null = null;
  programToDelete: ProgramModel | null = null;
  programToView: ProgramModel | null = null;

  ngOnInit() {
    this.loadDepartments();
    this.loadPrograms();
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadPrograms(): void {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
        this.filteredPrograms = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createProgram(): void {
    const payload = {
      code: this.code,
      nom: this.nom,
      departmentId: this.departmentId!,
      description: this.description,
    };
    this.programService.createProgram(payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Programme créé',
          'Le nouveau programme a été créé avec succès !',
        );
        this.code = '';
        this.nom = '';
        this.departmentId = null;
        this.description = '';
        this.loadPrograms();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du programme.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editProgram(): void {
    const payload = {
      code: this.editCode,
      nom: this.editNom,
      departmentId: this.editDepartmentId!,
      description: this.editDescription,
    };
    this.programService.updateProgram(this.programToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Programme modifié',
          'Le programme a été modifié avec succès !',
        );
        this.loadPrograms();
        this.closeModalEditProgram();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du programme.',
        );
        this.closeModalEditProgram();
      },
    });
  }

  deleteProgram(): void {
    this.programService.deleteProgram(this.programToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Programme supprimé',
          'Le programme a été supprimé avec succès !',
        );
        this.loadPrograms();
        this.closeModalDeleteProgram();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du programme.',
        );
        this.closeModalDeleteProgram();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getDepartmentName(departmentId: number): string {
    const dept = this.departments.find((d) => d.id === departmentId);
    return dept ? dept.nom : '—';
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;

  openModalCreateProgram() {
    this.modalCreateOpen = true;
  }

  closeModalCreateProgram() {
    this.modalCreateOpen = false;
    this.code = '';
    this.nom = '';
    this.departmentId = null;
    this.description = '';
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;

  openModalViewProgram(program: ProgramModel) {
    this.programToView = program;
    this.modalViewOpen = true;
  }

  closeModalViewProgram() {
    this.modalViewOpen = false;
    this.programToView = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  editCode: string = '';
  editNom: string = '';
  editDepartmentId: number | null = null;
  editDescription: string = '';

  openEditProgram(program: ProgramModel) {
    this.programToEdit = program;
    this.editCode = program.code;
    this.editNom = program.nom;
    this.editDepartmentId = program.departmentId;
    this.editDescription = program.description;
    this.modalEditOpen = true;
  }

  closeModalEditProgram() {
    this.modalEditOpen = false;
    this.programToEdit = null;
    this.editCode = '';
    this.editNom = '';
    this.editDepartmentId = null;
    this.editDescription = '';
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  deleteError = '';

  openDeleteProgram(program: ProgramModel) {
    this.programToDelete = program;
    this.deleteError = '';
    this.modalDeleteOpen = true;
  }

  closeModalDeleteProgram() {
    this.modalDeleteOpen = false;
    this.programToDelete = null;
    this.deleteError = '';
  }
}




// import { Component, OnInit } from '@angular/core';
// import { ModalComponent } from '../../../../shared/components/modal/modal.component';
// import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
// import { NotificationService } from '../../../../shared/components/notification/notification.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
//
// @Component({
//   standalone: true,
//   selector: 'app-program',
//   imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
//   templateUrl: './program.html',
//   styleUrl: './program.scss',
// })
// export class Program implements OnInit {
//   constructor(private notificationService: NotificationService) {}
//
//   ngOnInit() {
//     this.loadPrograms();
//   }
//
//   programs: any[] = [];
//
//   loadPrograms() {
//     this.programs = [
//       {
//         id: 1,
//         nom: 'Génie Logiciel',
//         code: 'GL',
//         cycle: 'Licence, Master',
//       },
//       {
//         id: 2,
//         nom: 'Administration Système & Réseaux',
//         code: 'ASR',
//         cycle: 'Master',
//       },
//     ];
//   }
//
//   // --->Create<---
//   modalCreateOpen = false;
//   openModalCreateProgram() {
//     this.modalCreateOpen = true;
//   }
//
//   closeModalCreateProgram() {
//     this.modalCreateOpen = false;
//   }
//
//   confirmCreateProgram() {
//     const payload = {};
//
//     this.notificationService.success(
//       'Département créée',
//       'Le nouveau département crée avec succès!',
//     );
//     this.closeModalCreateProgram();
//   }
//
//   // --->View<---
//   modalViewOpen = false;
//   openModalViewProgram() {
//     this.modalViewOpen = true;
//   }
//
//   closeModalViewProgram() {
//     this.modalViewOpen = false;
//   }
//
//   // --->Edit<---
//   modalEditOpen = false;
//   departmentToEdit: any = null;
//   editError = '';
//
//
//
//   openEditProgram(department: any) {
//     this.modalEditOpen = true;
//     this.departmentToEdit = department;
//     this.editError = '';
//   }
//
//   closeModalEditProgram() {
//     this.modalEditOpen = false;
//     this.departmentToEdit = null;
//     this.deleteError = '';
//   }
//
//   confirmEditProgram() {
//     if (!this.departmentToEdit) return;
//
//     this.notificationService.success(
//       'Département mis à jour',
//       'La mise à jour du département a été effectuée avec succès!',
//     );
//     this.closeModalEditProgram();
//   }
//
//   // --->Delete<---
//   modalDeleteOpen = false;
//   departmentToDelete: any = null;
//   deleteError = '';
//
//
//   openDeleteProgram(department: any) {
//     this.modalDeleteOpen = true;
//     this.departmentToDelete = department;
//     this.deleteError = '';
//   }
//
//   closeModalDeleteProgram() {
//     this.modalDeleteOpen = false;
//     this.departmentToDelete = null;
//     this.deleteError = '';
//   }
//
//   confirmDeleteProgram() {
//     if (!this.departmentToDelete) return;
//
//     this.notificationService.success(
//       'Département supprimé',
//       'Le département a été supprimé avec succès!',
//     );
//     this.closeModalDeleteProgram();
//   }
// }
