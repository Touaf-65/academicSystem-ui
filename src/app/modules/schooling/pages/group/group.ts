// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ModalComponent } from '../../../../shared/components/modal/modal.component';
// import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
// import { NotificationService } from '../../../../shared/components/notification/notification.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { GroupModel, GroupService } from '../../services/group/group-service';
// import { ClassModel, ClassService } from '../../../department/services/class/class-service';
// import { StudentModel, StudentService } from '../../services/student/student-service';
//
// @Component({
//   standalone: true,
//   selector: 'app-group',
//   imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
//   templateUrl: './group.html',
//   styleUrl: './group.scss',
// })
// export class Group implements OnInit {
//   constructor(
//     private notificationService: NotificationService,
//     private groupService: GroupService,
//     private classService: ClassService,
//     private studentService: StudentService,
//     private cdr: ChangeDetectorRef,
//   ) {}
//
//   // ──────────────────────────────────────────────
//   // Données
//   // ──────────────────────────────────────────────
//
//   groups: GroupModel[] = [];
//   filteredGroups: GroupModel[] = [];
//   classes: ClassModel[] = [];
//   students: StudentModel[] = [];
//
//   groupToEdit: GroupModel | null = null;
//   groupToDelete: GroupModel | null = null;
//   selectedGroup: GroupModel | null = null;
//
//   // ──────────────────────────────────────────────
//   // Filtres
//   // ──────────────────────────────────────────────
//
//   searchQuery: string = '';
//   filterClassRoomId: number | string = '';
//   filterType: 'TD' | 'TP' | '' = '';
//
//   applyFilters(): void {
//     const query = this.searchQuery.toLowerCase().trim();
//     this.filteredGroups = this.groups.filter((g) => {
//       const matchSearch = !query || g.nom.toLowerCase().includes(query);
//       const matchClass =
//         !this.filterClassRoomId || g.classRoomId === Number(this.filterClassRoomId);
//       const matchType = !this.filterType || g.type === this.filterType;
//       return matchSearch && matchClass && matchType;
//     });
//   }
//
//   resetFilters(): void {
//     this.searchQuery = '';
//     this.filterClassRoomId = '';
//     this.filterType = '';
//     this.filteredGroups = [...this.groups];
//   }
//
//   get hasActiveFilters(): boolean {
//     return !!(this.searchQuery || this.filterClassRoomId || this.filterType);
//   }
//
//   // ──────────────────────────────────────────────
//   // Helpers
//   // ──────────────────────────────────────────────
//
//   getClassName(classRoomId: number): string {
//     return this.classes.find((c) => c.id === classRoomId)?.nom ?? '—';
//   }
//
//   getStudentName(id: number): string {
//     return this.students.find((s) => s.id === id)?.nom ?? '—';
//   }
//
//   getStudentMatricule(id: number): string {
//     return this.students.find((s) => s.id === id)?.matricule ?? '—';
//   }
//
//   getAssignedStudents(group: GroupModel): StudentModel[] {
//     return (group as any).studentIds
//       ? (group as any).studentIds
//           .map((id: number) => this.students.find((s) => s.id === id))
//           .filter((s: StudentModel | undefined): s is StudentModel => !!s)
//       : [];
//   }
//
//   getUnassignedStudents(group: GroupModel): StudentModel[] {
//     const assignedIds: number[] = (group as any).studentIds ?? [];
//     return this.students.filter((s) => !assignedIds.includes(s.id));
//   }
//
//   // ──────────────────────────────────────────────
//   // Chargements
//   // ──────────────────────────────────────────────
//
//   ngOnInit(): void {
//     this.classService.getClasss().subscribe({
//       next: (data) => {
//         this.classes = data;
//         this.cdr.detectChanges();
//       },
//     });
//     this.studentService.getStudents().subscribe({
//       next: (data) => {
//         this.students = data;
//         this.cdr.detectChanges();
//       },
//     });
//     this.loadGroups();
//   }
//
//   loadGroups(): void {
//     this.groupService.getGroups().subscribe({
//       next: (data) => {
//         this.groups = data;
//         this.filteredGroups = data;
//         this.cdr.detectChanges();
//       },
//     });
//   }
//
//   // ──────────────────────────────────────────────
//   // CRUD
//   // ──────────────────────────────────────────────
//
//   createGroup(): void {
//     const payload = {
//       nom: this.createNom,
//       type: this.createType,
//       capaciteMax: this.createCapaciteMax,
//       classRoomId: this.createClassRoomId!,
//     };
//     this.groupService.createGroup(payload).subscribe({
//       next: () => {
//         this.notificationService.success(
//           'Groupe créé',
//           'Le nouveau groupe a été créé avec succès !',
//         );
//         this.resetCreateForm();
//         this.loadGroups();
//         this.modalCreateOpen = false;
//       },
//       error: () => {
//         this.notificationService.error(
//           'Erreur',
//           'Une erreur est survenue lors de la création du groupe.',
//         );
//         this.modalCreateOpen = false;
//       },
//     });
//   }
//
//   editGroup(): void {
//     const payload = {
//       nom: this.editNom,
//       type: this.editType,
//       capacite: this.editCapaciteMax,
//     };
//     this.groupService.updateGroup(this.groupToEdit!.id, payload).subscribe({
//       next: () => {
//         this.notificationService.success('Groupe modifié', 'Le groupe a été modifié avec succès !');
//         this.loadGroups();
//         this.closeModalEdit();
//       },
//       error: () => {
//         this.notificationService.error(
//           'Erreur',
//           'Une erreur est survenue lors de la modification du groupe.',
//         );
//         this.closeModalEdit();
//       },
//     });
//   }
//
//   deleteGroup(): void {
//     this.groupService.deleteGroup(this.groupToDelete!.id).subscribe({
//       next: () => {
//         this.notificationService.success(
//           'Groupe supprimé',
//           'Le groupe a été supprimé avec succès !',
//         );
//         this.loadGroups();
//         this.closeModalDelete();
//       },
//       error: () => {
//         this.notificationService.error(
//           'Erreur',
//           'Une erreur est survenue lors de la suppression du groupe.',
//         );
//         this.closeModalDelete();
//       },
//     });
//   }
//
//   // ──────────────────────────────────────────────
//   // Assignation / Désassignation étudiants
//   // ──────────────────────────────────────────────
//
//   assigningStudentId: number | null = null;
//   assignLoading = false;
//
//   assignStudent(): void {
//     if (!this.assigningStudentId || !this.groupToEdit) return;
//     this.assignLoading = true;
//     this.groupService.assignStudent(this.groupToEdit.id, this.assigningStudentId).subscribe({
//       next: (updated) => {
//         const idx = this.groups.findIndex((g) => g.id === updated.id);
//         if (idx !== -1) this.groups[idx] = updated;
//         this.groupToEdit = updated;
//         this.assigningStudentId = null;
//         this.assignLoading = false;
//         this.notificationService.success('Étudiant assigné', "L'étudiant a été assigné au groupe.");
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.notificationService.error('Erreur', "Une erreur est survenue lors de l'assignation.");
//         this.assignLoading = false;
//       },
//     });
//   }
//
//   unassignStudent(studentId: number): void {
//     if (!this.groupToEdit) return;
//     this.groupService.unassignStudent(this.groupToEdit.id, studentId).subscribe({
//       next: () => {
//         const assignedIds: number[] = (this.groupToEdit as any).studentIds ?? [];
//         const updated = {
//           ...this.groupToEdit!,
//           studentIds: assignedIds.filter((id) => id !== studentId),
//         } as GroupModel;
//         const idx = this.groups.findIndex((g) => g.id === updated.id);
//         if (idx !== -1) this.groups[idx] = updated;
//         this.groupToEdit = updated;
//         this.notificationService.success('Étudiant retiré', "L'étudiant a été retiré du groupe.");
//         this.cdr.detectChanges();
//       },
//       error: () => {
//         this.notificationService.error(
//           'Erreur',
//           'Une erreur est survenue lors de la désassignation.',
//         );
//       },
//     });
//   }
//
//   // ──────────────────────────────────────────────
//   // Modal : Créer
//   // ──────────────────────────────────────────────
//   modalCreateOpen = false;
//   createNom: string = '';
//   createType: 'TD' | 'TP' = 'TD';
//   createCapaciteMax: number = 0;
//   createClassRoomId: number | null = null;
//
//   openModalCreate(): void {
//     this.modalCreateOpen = true;
//   }
//   closeModalCreate(): void {
//     this.modalCreateOpen = false;
//     this.resetCreateForm();
//   }
//   resetCreateForm(): void {
//     this.createNom = '';
//     this.createType = 'TD';
//     this.createCapaciteMax = 0;
//     this.createClassRoomId = null;
//   }
//
//   // ──────────────────────────────────────────────
//   // Modal : Voir
//   // ──────────────────────────────────────────────
//   modalViewOpen = false;
//   openModalView(group: GroupModel): void {
//     this.selectedGroup = group;
//     this.modalViewOpen = true;
//   }
//   closeModalView(): void {
//     this.modalViewOpen = false;
//     this.selectedGroup = null;
//   }
//
//   // ──────────────────────────────────────────────
//   // Modal : Éditer (tabs)
//   // ──────────────────────────────────────────────
//   modalEditOpen = false;
//   editNom: string = '';
//   editType: 'TD' | 'TP' = 'TD';
//   editCapaciteMax: number = 0;
//   editActiveTab: 'infos' | 'etudiants' = 'infos';
//   editError: string = '';
//
//   openModalEdit(group: GroupModel): void {
//     this.groupToEdit = { ...group };
//     this.editNom = group.nom;
//     this.editType = group.type;
//     this.editCapaciteMax = group.capaciteMax;
//     this.editActiveTab = 'infos';
//     this.assigningStudentId = null;
//     this.editError = '';
//     this.modalEditOpen = true;
//   }
//
//   closeModalEdit(): void {
//     this.modalEditOpen = false;
//     this.groupToEdit = null;
//     this.editNom = '';
//     this.editType = 'TD';
//     this.editCapaciteMax = 0;
//     this.assigningStudentId = null;
//     this.editError = '';
//   }
//
//   // ──────────────────────────────────────────────
//   // Modal : Supprimer
//   // ──────────────────────────────────────────────
//   modalDeleteOpen = false;
//   deleteError: string = '';
//
//   openModalDelete(group: GroupModel): void {
//     this.groupToDelete = group;
//     this.deleteError = '';
//     this.modalDeleteOpen = true;
//   }
//   closeModalDelete(): void {
//     this.modalDeleteOpen = false;
//     this.groupToDelete = null;
//     this.deleteError = '';
//   }
// }




import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupModel, GroupService } from '../../services/group/group-service';
import { ClassModel, ClassService } from '../../../department/services/class/class-service';

@Component({
  standalone: true,
  selector: 'app-group',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './group.html',
  styleUrl: './group.scss',
})
export class Group implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private groupService: GroupService,
    private classService: ClassService,
    private cdr: ChangeDetectorRef,
  ) {}

  // --- Données ---
  groups: GroupModel[] = [];
  filteredGroups: GroupModel[] = [];
  classes: ClassModel[] = [];

  // --- Filtres ---
  searchQuery: string = '';
  filterClassRoomId: number | string = '';
  filterType: 'TD' | 'TP' | '' = '';

  // --- Modèles ciblés ---
  groupToEdit: GroupModel | null = null;
  groupToDelete: GroupModel | null = null;
  selectedGroup: GroupModel | null = null;

  ngOnInit(): void {
    this.loadGroups();
    this.loadClasses();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.filteredGroups = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadClasses(): void {
    this.classService.getClasss().subscribe({
      next: (data) => {
        this.classes = data;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredGroups = this.groups.filter((g) => {
      const matchSearch = !query || g.nom.toLowerCase().includes(query);
      const matchClass =
        !this.filterClassRoomId || g.classRoomId === Number(this.filterClassRoomId);
      const matchType = !this.filterType || g.type === this.filterType;
      return matchSearch && matchClass && matchType;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterClassRoomId = '';
    this.filterType = '';
    this.filteredGroups = [...this.groups];
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.filterClassRoomId || this.filterType);
  }

  getClassName(classRoomId: number): string {
    return this.classes.find((c) => c.id === classRoomId)?.nom ?? '—';
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createGroup(): void {
    const payload = {
      nom: this.createNom,
      type: this.createType,
      capaciteMax: this.createCapacite,
      classRoomId: this.createClassRoomId!,
    };
    this.groupService.createGroup(payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Groupe créé',
          'Le nouveau groupe a été créé avec succès !',
        );
        this.resetCreateForm();
        this.loadGroups();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du groupe.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editGroup(): void {
    const payload = {
      nom: this.editNom,
      type: this.editType,
      capacite: this.editCapacite,
    };
    this.groupService.updateGroup(this.groupToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Groupe modifié', 'Le groupe a été modifié avec succès !');
        this.loadGroups();
        this.closeModalEdit();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du groupe.',
        );
        this.closeModalEdit();
      },
    });
  }

  deleteGroup(): void {
    this.groupService.deleteGroup(this.groupToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Groupe supprimé',
          'Le groupe a été supprimé avec succès !',
        );
        this.loadGroups();
        this.closeModalDelete();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du groupe.',
        );
        this.closeModalDelete();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;
  createNom: string = '';
  createType: 'TD' | 'TP' = 'TD';
  createCapacite: number = 0;
  createClassRoomId: number | null = null;

  openModalCreate(): void {
    this.modalCreateOpen = true;
  }
  closeModalCreate(): void {
    this.modalCreateOpen = false;
    this.resetCreateForm();
  }
  resetCreateForm(): void {
    this.createNom = '';
    this.createType = 'TD';
    this.createCapacite = 0;
    this.createClassRoomId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;
  openModalView(group: GroupModel): void {
    this.selectedGroup = group;
    this.modalViewOpen = true;
  }
  closeModalView(): void {
    this.modalViewOpen = false;
    this.selectedGroup = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Éditer
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  editNom: string = '';
  editType: 'TD' | 'TP' = 'TD';
  editCapacite: number = 0;
  editError: string = '';

  openModalEdit(group: GroupModel): void {
    this.groupToEdit = group;
    this.editNom = group.nom;
    this.editType = group.type;
    this.editCapacite = group.capaciteMax;
    this.editError = '';
    this.modalEditOpen = true;
  }
  closeModalEdit(): void {
    this.modalEditOpen = false;
    this.groupToEdit = null;
    this.editNom = '';
    this.editType = 'TD';
    this.editCapacite = 0;
    this.editError = '';
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  deleteError: string = '';

  openModalDelete(group: GroupModel): void {
    this.groupToDelete = group;
    this.deleteError = '';
    this.modalDeleteOpen = true;
  }
  closeModalDelete(): void {
    this.modalDeleteOpen = false;
    this.groupToDelete = null;
    this.deleteError = '';
  }
}
