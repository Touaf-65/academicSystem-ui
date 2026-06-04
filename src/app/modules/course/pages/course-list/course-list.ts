import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseModel, CourseService } from '../../services/course/course-service';
import { DepartmentModel, DepartmentService } from '../../../department/services/department/department-service';
import { TeacherModel, TeacherService } from '../../../teacher/services/teacher/teacher-service';
import { LevelModel, LevelService } from '../../../department/services/level/level-service';

@Component({
  standalone: true,
  selector: 'app-course-list',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private courseService: CourseService,
    private departmentService: DepartmentService,
    private teacherService: TeacherService,
    private levelService: LevelService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ──────────────────────────────────────────────
  // Données
  // ──────────────────────────────────────────────

  courses: CourseModel[] = [];
  filteredCourses: CourseModel[] = [];
  departments: DepartmentModel[] = [];
  teachers: TeacherModel[] = [];
  levels: LevelModel[] = [];

  // ──────────────────────────────────────────────
  // Filtres
  // ──────────────────────────────────────────────

  searchQuery: string = '';
  filterDepartmentId: number | null = null;
  filterLevelId: number | null = null;

  onSearchChange(): void {
    this.applyFilters();
  }
  onFilterDeptChange(): void {
    this.applyFilters();
  }
  onFilterLevelChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter((c) => {
      const matchSearch = this.searchQuery
        ? c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchDept = this.filterDepartmentId ? c.departmentId === this.filterDepartmentId : true;
      // Le filtre niveau sera branché quand courseModel portera levelId
      return matchSearch && matchDept;
    });
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getDepartmentName(id: number): string {
    return this.departments.find((d) => d.id === id)?.nom ?? '—';
  }

  getTeacherName(id: number): string {
    const t = this.teachers.find((t) => t.id === id);
    return t ? t.nom : '—';
  }

  getAssignedTeachers(course: CourseModel): TeacherModel[] {
    return course?.teacherIds
      .map((id) => this.teachers.find((t) => t.id === id))
      .filter((t): t is TeacherModel => !!t);
  }

  getUnassignedTeachers(course: CourseModel): TeacherModel[] {
    return this.teachers.filter((t) => !course.teacherIds.includes(t.id));
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.cdr.detectChanges();
      },
    });
    this.teacherService.getTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.cdr.detectChanges();
      },
    });
    this.levelService.getLevels().subscribe({
      next: (data) => {
        this.levels = data;
        this.cdr.detectChanges();
      },
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createCourse(): void {
    const payload = {
      name: this.cName,
      code: this.cCode,
      volumeHoraire: this.cVolumeHoraire!,
      departmentId: this.cDepartmentId!,
      teacherIds: this.cTeacherIds!,
    };
    this.courseService.createCourse(payload).subscribe({
      next: () => {
        this.notificationService.success('Cours créé', 'Le nouveau cours a été créé avec succès !');
        this.resetCreateForm();
        this.loadCourses();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du cours.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editCourse(): void {
    const payload = {
      name: this.editName,
      code: this.editCode,
      volumeHoraire: this.editVolumeHoraire!,
      departmentId: this.editDepartmentId!,
      teacherIds: this.courseToEdit!.teacherIds,
    };
    this.courseService.updateCourse(this.courseToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Cours modifié', 'Le cours a été modifié avec succès !');
        this.loadCourses();
        this.closeModalEdit();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du cours.',
        );
        this.closeModalEdit();
      },
    });
  }

  deleteCourse(): void {
    this.courseService.deleteCourse(this.courseToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Cours supprimé', 'Le cours a été supprimé avec succès !');
        this.loadCourses();
        this.closeModalDelete();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du cours.',
        );
        this.closeModalDelete();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Assignation / Désassignation enseignants
  // ──────────────────────────────────────────────

  assigningTeacherId: number | null = null;
  assignLoading = false;

  assignTeacher(): void {
    if (!this.assigningTeacherId || !this.courseToEdit) return;
    this.assignLoading = true;
    this.courseService.assignTeacher(this.courseToEdit.id, this.assigningTeacherId).subscribe({
      next: (updated) => {
        // Mettre à jour la liste locale
        const idx = this.courses.findIndex((c) => c.id === updated.id);
        if (idx !== -1) this.courses[idx] = updated;
        // Mettre à jour courseToEdit en place (sans fermer le modal)
        this.courseToEdit = updated;
        this.assigningTeacherId = null;
        this.assignLoading = false;
        this.notificationService.success(
          'Enseignant assigné',
          "L'enseignant a été assigné au cours.",
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Erreur', "Une erreur est survenue lors de l'assignation.");
        this.assignLoading = false;
      },
    });
  }

  unassignTeacher(teacherId: number): void {
    if (!this.courseToEdit) return;
    this.courseService.unassignTeacher(this.courseToEdit.id, teacherId).subscribe({
      next: () => {
        // Mettre à jour localement
        const updated: CourseModel = {
          ...this.courseToEdit!,
          teacherIds: this.courseToEdit!.teacherIds.filter((id) => id !== teacherId),
        };
        const idx = this.courses.findIndex((c) => c.id === updated.id);
        if (idx !== -1) this.courses[idx] = updated;
        this.courseToEdit = updated;
        this.notificationService.success(
          'Enseignant désassigné',
          "L'enseignant a été retiré du cours.",
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la désassignation.',
        );
      },
    });
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;
  cName: string = '';
  cCode: string = '';
  cVolumeHoraire: number | null = null;
  cDepartmentId: number | null = null;
  cTeacherIds: number[] = [];

  toggleCreateTeacher(id: number): void {
    const idx = this.cTeacherIds.indexOf(id);
    if (idx === -1) this.cTeacherIds = [...this.cTeacherIds, id];
    else this.cTeacherIds = this.cTeacherIds.filter((t) => t !== id);
  }
  isCreateTeacherSelected(id: number): boolean {
    return this.cTeacherIds.includes(id);
  }

  resetCreateForm(): void {
    this.cName = '';
    this.cCode = '';
    this.cVolumeHoraire = null;
    this.cDepartmentId = null;
    this.cTeacherIds = [];
  }

  openModalCreate(): void {
    this.modalCreateOpen = true;
  }
  closeModalCreate(): void {
    this.modalCreateOpen = false;
    this.resetCreateForm();
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;
  courseToView: CourseModel | null = null;

  openModalView(c: CourseModel): void {
    this.courseToView = c;
    this.modalViewOpen = true;
  }
  closeModalView(): void {
    this.modalViewOpen = false;
    this.courseToView = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Modifier (avec section assignation)
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  courseToEdit: CourseModel | null = null;
  editName: string = '';
  editCode: string = '';
  editVolumeHoraire: number | null = null;
  editDepartmentId: number | null = null;
  editActiveTab: 'infos' | 'enseignants' = 'infos';

  openModalEdit(c: CourseModel): void {
    this.courseToEdit = { ...c, teacherIds: [...c.teacherIds] };
    this.editName = c.name;
    this.editCode = c.code;
    this.editVolumeHoraire = c.volumeHoraire;
    this.editDepartmentId = c.departmentId;
    this.editActiveTab = 'infos';
    this.assigningTeacherId = null;
    this.modalEditOpen = true;
  }

  closeModalEdit(): void {
    this.modalEditOpen = false;
    this.courseToEdit = null;
    this.editName = '';
    this.editCode = '';
    this.editVolumeHoraire = null;
    this.editDepartmentId = null;
    this.assigningTeacherId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  courseToDelete: CourseModel | null = null;

  openModalDelete(c: CourseModel): void {
    this.courseToDelete = c;
    this.modalDeleteOpen = true;
  }
  closeModalDelete(): void {
    this.modalDeleteOpen = false;
    this.courseToDelete = null;
  }
}
