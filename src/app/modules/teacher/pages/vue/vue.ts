import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeacherModel, TeacherService } from '../../services/teacher/teacher-service';
import { DepartmentModel, DepartmentService } from '../../../department/services/department/department-service';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private teacherService: TeacherService,
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ──────────────────────────────────────────────
  // Données
  // ──────────────────────────────────────────────

  teachers: TeacherModel[] = [];
  filteredTeachers: TeacherModel[] = [];
  departments: DepartmentModel[] = [];

  // ──────────────────────────────────────────────
  // Statistiques
  // ──────────────────────────────────────────────

  get statTeachers(): number { return this.teachers.length; }
  get statDepartments(): number { return this.departments.length; }
  // Nombre unique de classes (courseIds) toutes enseignants confondus
  get statClasses(): number {
    const ids = new Set(this.teachers.flatMap((t) => t.courseIds));
    return ids.size;
  }
  // Cours : sera rendu dynamique quand le service sera connecté
  statCours: number = 0;

  // ──────────────────────────────────────────────
  // Filtres
  // ──────────────────────────────────────────────

  searchQuery: string = '';

  // Filtre multi-départements
  selectedDepartmentIds: number[] = [];
  departmentDropdownOpen = false;

  toggleDepartmentDropdown(): void {
    this.departmentDropdownOpen = !this.departmentDropdownOpen;
  }

  closeDepartmentDropdown(): void {
    this.departmentDropdownOpen = false;
  }

  toggleDepartmentFilter(id: number): void {
    const idx = this.selectedDepartmentIds.indexOf(id);
    if (idx === -1) {
      this.selectedDepartmentIds = [...this.selectedDepartmentIds, id];
    } else {
      this.selectedDepartmentIds = this.selectedDepartmentIds.filter((d) => d !== id);
    }
    this.applyFilters();
  }

  isDepartmentSelected(id: number): boolean {
    return this.selectedDepartmentIds.includes(id);
  }

  clearDepartmentFilter(): void {
    this.selectedDepartmentIds = [];
    this.applyFilters();
  }

  getDepartmentFilterLabel(): string {
    if (this.selectedDepartmentIds.length === 0) return 'Tous les départements';
    if (this.selectedDepartmentIds.length === 1) {
      const dept = this.departments.find((d) => d.id === this.selectedDepartmentIds[0]);
      return dept ? dept.nom : '1 département';
    }
    return `${this.selectedDepartmentIds.length} départements`;
  }

  // Filtre multi-cours (statique pour l'instant, rendu dynamique plus tard)
  availableCours: { id: number; nom: string }[] = [
    { id: 1, nom: 'Mathématiques' },
    { id: 2, nom: 'Informatique' },
    { id: 3, nom: 'Physique' },
    { id: 4, nom: 'Économie' },
  ];
  selectedCoursIds: number[] = [];
  coursDropdownOpen = false;

  toggleCoursDropdown(): void {
    this.coursDropdownOpen = !this.coursDropdownOpen;
  }

  closeCoursDropdown(): void {
    this.coursDropdownOpen = false;
  }

  toggleCoursFilter(id: number): void {
    const idx = this.selectedCoursIds.indexOf(id);
    if (idx === -1) {
      this.selectedCoursIds = [...this.selectedCoursIds, id];
    } else {
      this.selectedCoursIds = this.selectedCoursIds.filter((c) => c !== id);
    }
    this.applyFilters();
  }

  isCoursSelected(id: number): boolean {
    return this.selectedCoursIds.includes(id);
  }

  clearCoursFilter(): void {
    this.selectedCoursIds = [];
    this.applyFilters();
  }

  getCoursFilterLabel(): string {
    if (this.selectedCoursIds.length === 0) return 'Tous les cours';
    if (this.selectedCoursIds.length === 1) {
      const cours = this.availableCours.find((c) => c.id === this.selectedCoursIds[0]);
      return cours ? cours.nom : '1 cours';
    }
    return `${this.selectedCoursIds.length} cours`;
  }

  applyFilters(): void {
    this.filteredTeachers = this.teachers.filter((t) => {
      const matchSearch = this.searchQuery
        ? t.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      const matchDepts =
        this.selectedDepartmentIds.length === 0
          ? true
          : this.selectedDepartmentIds.some((id) => t.departmentIds.includes(id));

      const matchCours =
        this.selectedCoursIds.length === 0
          ? true
          : this.selectedCoursIds.some((id) => t.courseIds.includes(id));

      return matchSearch && matchDepts && matchCours;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getDepartmentNames(ids: number[]): string {
    return ids
      .map((id) => this.departments.find((d) => d.id === id)?.nom ?? '—')
      .join(', ');
  }

  getDepartmentBadges(ids: number[]): DepartmentModel[] {
    return ids
      .map((id) => this.departments.find((d) => d.id === id))
      .filter((d): d is DepartmentModel => !!d);
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => { this.departments = data; this.cdr.detectChanges(); },
    });
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.filteredTeachers = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createTeacher(): void {
    const payload = {
      id: 0,
      email: this.tEmail,
      nom: this.tNom,
      password: this.tPassword,
      departmentIds: this.tDepartmentIds,
      courseIds: [],
    };
    this.teacherService.createTeacher(payload).subscribe({
      next: () => {
        this.notificationService.success('Enseignant créé', 'Le nouvel enseignant a été créé avec succès !');
        this.resetCreateForm();
        this.loadTeachers();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création.');
        this.modalCreateOpen = false;
      },
    });
  }

  editTeacher(): void {
    const payload = {
      id: this.teacherToEdit!.id,
      email: this.editEmail,
      nom: this.editNom,
      password: this.editPassword,
      departmentIds: this.editDepartmentIds,
      courseIds: this.teacherToEdit!.courseIds,
    };
    this.teacherService.updateTeacher(this.teacherToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Enseignant modifié', 'L\'enseignant a été modifié avec succès !');
        this.loadTeachers();
        this.closeModalEdit();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification.');
        this.closeModalEdit();
      },
    });
  }

  deleteTeacher(): void {
    this.teacherService.deleteTeacher(this.teacherToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Enseignant supprimé', 'L\'enseignant a été supprimé avec succès !');
        this.loadTeachers();
        this.closeModalDelete();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression.');
        this.closeModalDelete();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;
  tNom: string = '';
  tEmail: string = '';
  tPassword: string = '';
  tDepartmentIds: number[] = [];

  toggleCreateDept(id: number): void {
    const idx = this.tDepartmentIds.indexOf(id);
    if (idx === -1) this.tDepartmentIds = [...this.tDepartmentIds, id];
    else this.tDepartmentIds = this.tDepartmentIds.filter((d) => d !== id);
  }

  isCreateDeptSelected(id: number): boolean { return this.tDepartmentIds.includes(id); }

  resetCreateForm(): void {
    this.tNom = ''; this.tEmail = ''; this.tDepartmentIds = [];
  }

  openModalCreate(): void { this.modalCreateOpen = true; }
  closeModalCreate(): void { this.modalCreateOpen = false; this.resetCreateForm(); }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;
  teacherToView: TeacherModel | null = null;

  openModalView(t: TeacherModel): void { this.teacherToView = t; this.modalViewOpen = true; }
  closeModalView(): void { this.modalViewOpen = false; this.teacherToView = null; }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  teacherToEdit: TeacherModel | null = null;
  editNom: string = '';
  editEmail: string = '';
  editPassword: string = '';
  editDepartmentIds: number[] = [];

  toggleEditDept(id: number): void {
    const idx = this.editDepartmentIds.indexOf(id);
    if (idx === -1) this.editDepartmentIds = [...this.editDepartmentIds, id];
    else this.editDepartmentIds = this.editDepartmentIds.filter((d) => d !== id);
  }

  isEditDeptSelected(id: number): boolean { return this.editDepartmentIds.includes(id); }

  openModalEdit(t: TeacherModel): void {
    this.teacherToEdit = t;
    this.editNom = t.nom;
    this.editEmail = t.email;
    this.editDepartmentIds = [...t.departmentIds];
    this.modalEditOpen = true;
  }

  closeModalEdit(): void {
    this.modalEditOpen = false;
    this.teacherToEdit = null;
    this.editNom = ''; this.editEmail = ''; this.editDepartmentIds = [];
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  teacherToDelete: TeacherModel | null = null;

  openModalDelete(t: TeacherModel): void { this.teacherToDelete = t; this.modalDeleteOpen = true; }
  closeModalDelete(): void { this.modalDeleteOpen = false; this.teacherToDelete = null; }
}
