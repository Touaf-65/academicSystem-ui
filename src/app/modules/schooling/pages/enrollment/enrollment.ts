import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnrollmentModel, EnrollmentService } from '../../services/enrollment/enrollment-service';
import { StudentModel, StudentService } from '../../services/student/student-service';
import { DepartmentModel, DepartmentService } from '../../../department/services/department/department-service';
import { ProgramModel, ProgramService } from '../../../department/services/program/program-service';
import { CycleModel, CycleService } from '../../../department/services/cycle/cycle-service';
import { LevelModel, LevelService } from '../../../department/services/level/level-service';

// Adaptez selon votre ClassroomService réel
export interface ClassRoomModel { id: number; nom: string; code: string; levelId: number; }

@Component({
  standalone: true,
  selector: 'app-enrollment',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.scss',
})
export class Enrollment implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private programService: ProgramService,
    private cycleService: CycleService,
    private levelService: LevelService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ──────────────────────────────────────────────
  // Données brutes
  // ──────────────────────────────────────────────

  enrollments: EnrollmentModel[] = [];
  filteredEnrollments: EnrollmentModel[] = [];
  students: StudentModel[] = [];
  departments: DepartmentModel[] = [];
  programs: ProgramModel[] = [];
  cycles: CycleModel[] = [];
  levels: LevelModel[] = [];
  classRooms: ClassRoomModel[] = []; // à brancher via ClassRoomService

  // ──────────────────────────────────────────────
  // Filtres en cascade
  // ──────────────────────────────────────────────

  searchQuery: string = '';
  filterDepartmentId: number | null = null;
  filterProgramId: number | null = null;
  filterCycleId: number | null = null;
  filterLevelId: number | null = null;
  filterClassRoomId: number | null = null;
  filterAcademicYear: string = '';

  // Listes filtrées pour chaque niveau de la cascade
  filteredProgramsForFilter: ProgramModel[] = [];
  filteredCyclesForFilter: CycleModel[] = [];
  filteredLevelsForFilter: LevelModel[] = [];
  filteredClassRoomsForFilter: ClassRoomModel[] = [];

  get availableAcademicYears(): string[] {
    return [...new Set(this.enrollments.map((e) => e.academicYear))].sort((a, b) => b.localeCompare(a));
  }

  onFilterDeptChange(): void {
    this.filterProgramId = null;
    this.filterCycleId = null;
    this.filterLevelId = null;
    this.filterClassRoomId = null;
    this.filteredProgramsForFilter = this.filterDepartmentId
      ? this.programs.filter((p) => p.departmentId === this.filterDepartmentId)
      : [];
    this.filteredCyclesForFilter = [];
    this.filteredLevelsForFilter = [];
    this.filteredClassRoomsForFilter = [];
    this.applyFilters();
  }

  onFilterProgramChange(): void {
    this.filterCycleId = null;
    this.filterLevelId = null;
    this.filterClassRoomId = null;
    this.filteredCyclesForFilter = this.filterProgramId
      ? this.cycles.filter((c) => c.programId === this.filterProgramId)
      : [];
    this.filteredLevelsForFilter = [];
    this.filteredClassRoomsForFilter = [];
    this.applyFilters();
  }

  onFilterCycleChange(): void {
    this.filterLevelId = null;
    this.filterClassRoomId = null;
    this.filteredLevelsForFilter = this.filterCycleId
      ? this.levels.filter((l) => l.cycleId === this.filterCycleId)
      : [];
    this.filteredClassRoomsForFilter = [];
    this.applyFilters();
  }

  onFilterLevelChange(): void {
    this.filterClassRoomId = null;
    this.filteredClassRoomsForFilter = this.filterLevelId
      ? this.classRooms.filter((cr) => cr.levelId === this.filterLevelId)
      : [];
    this.applyFilters();
  }

  onFilterClassRoomChange(): void { this.applyFilters(); }
  onFilterYearChange(): void { this.applyFilters(); }
  onSearchChange(): void { this.applyFilters(); }

  applyFilters(): void {
    this.filteredEnrollments = this.enrollments.filter((e) => {
      const student = this.getStudent(e.studentId);
      const fullName = student ? `${student.nom}`.toLowerCase() : '';
      const email = student?.email?.toLowerCase() ?? '';
      const matricule = student?.matricule?.toLowerCase() ?? '';

      const matchSearch = this.searchQuery
        ? fullName.includes(this.searchQuery.toLowerCase()) ||
        email.includes(this.searchQuery.toLowerCase()) ||
        matricule.includes(this.searchQuery.toLowerCase())
        : true;

      const matchYear = this.filterAcademicYear
        ? e.academicYear === this.filterAcademicYear
        : true;

      const matchClassRoom = this.filterClassRoomId
        ? e.classRoomId === this.filterClassRoomId
        : true;

      // Filtres hiérarchiques : vérifier que classRoom appartient au niveau/cycle/programme/dept
      const matchLevel = this.filterLevelId
        ? this.classRooms.find((cr) => cr.id === e.classRoomId)?.levelId === this.filterLevelId
        : true;

      const matchCycle = this.filterCycleId
        ? (() => {
          const cr = this.classRooms.find((c) => c.id === e.classRoomId);
          const level = cr ? this.levels.find((l) => l.id === cr.levelId) : null;
          return level?.cycleId === this.filterCycleId;
        })()
        : true;

      const matchProgram = this.filterProgramId
        ? (() => {
          const cr = this.classRooms.find((c) => c.id === e.classRoomId);
          const level = cr ? this.levels.find((l) => l.id === cr.levelId) : null;
          const cycle = level ? this.cycles.find((cy) => cy.id === level.cycleId) : null;
          return cycle?.programId === this.filterProgramId;
        })()
        : true;

      const matchDept = this.filterDepartmentId
        ? (() => {
          const cr = this.classRooms.find((c) => c.id === e.classRoomId);
          const level = cr ? this.levels.find((l) => l.id === cr.levelId) : null;
          const cycle = level ? this.cycles.find((cy) => cy.id === level.cycleId) : null;
          const program = cycle ? this.programs.find((p) => p.id === cycle.programId) : null;
          return program?.departmentId === this.filterDepartmentId;
        })()
        : true;

      return matchSearch && matchYear && matchClassRoom && matchLevel && matchCycle && matchProgram && matchDept;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterDepartmentId = null;
    this.filterProgramId = null;
    this.filterCycleId = null;
    this.filterLevelId = null;
    this.filterClassRoomId = null;
    this.filterAcademicYear = '';
    this.filteredProgramsForFilter = [];
    this.filteredCyclesForFilter = [];
    this.filteredLevelsForFilter = [];
    this.filteredClassRoomsForFilter = [];
    this.filteredEnrollments = [...this.enrollments];
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.filterDepartmentId || this.filterAcademicYear || this.filterClassRoomId);
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getStudent(id: number): StudentModel | undefined {
    return this.students.find((s) => s.id === id);
  }

  getStudentFullName(id: number): string {
    const s = this.getStudent(id);
    return s ? `${s.nom}` : '—';
  }

  getStudentMatricule(id: number): string {
    return this.getStudent(id)?.matricule ?? '—';
  }

  getClassRoomName(id: number): string {
    return this.classRooms.find((cr) => cr.id === id)?.nom ?? '—';
  }

  getHierarchyLabel(classRoomId: number): string {
    const cr = this.classRooms.find((c) => c.id === classRoomId);
    if (!cr) return '—';
    const level = this.levels.find((l) => l.id === cr.levelId);
    const cycle = level ? this.cycles.find((cy) => cy.id === level.cycleId) : null;
    const program = cycle ? this.programs.find((p) => p.id === cycle.programId) : null;
    const dept = program ? this.departments.find((d) => d.id === program.departmentId) : null;
    return [dept?.nom, program?.nom, cycle?.nom, level?.nom].filter(Boolean).join(' › ');
  }

  // Cascade dans les modals création
  filteredProgramsForCreate: ProgramModel[] = [];
  filteredCyclesForCreate: CycleModel[] = [];
  filteredLevelsForCreate: LevelModel[] = [];
  filteredClassRoomsForCreate: ClassRoomModel[] = [];

  onCreateDeptChange(): void {
    this.eProgramId = null; this.eCycleId = null; this.eLevelId = null; this.eClassRoomId = null;
    this.filteredProgramsForCreate = this.eDepartmentId
      ? this.programs.filter((p) => p.departmentId === this.eDepartmentId) : [];
    this.filteredCyclesForCreate = []; this.filteredLevelsForCreate = []; this.filteredClassRoomsForCreate = [];
  }

  onCreateProgramChange(): void {
    this.eCycleId = null; this.eLevelId = null; this.eClassRoomId = null;
    this.filteredCyclesForCreate = this.eProgramId
      ? this.cycles.filter((c) => c.programId === this.eProgramId) : [];
    this.filteredLevelsForCreate = []; this.filteredClassRoomsForCreate = [];
  }

  onCreateCycleChange(): void {
    this.eLevelId = null; this.eClassRoomId = null;
    this.filteredLevelsForCreate = this.eCycleId
      ? this.levels.filter((l) => l.cycleId === this.eCycleId) : [];
    this.filteredClassRoomsForCreate = [];
  }

  onCreateLevelChange(): void {
    this.eClassRoomId = null;
    this.filteredClassRoomsForCreate = this.eLevelId
      ? this.classRooms.filter((cr) => cr.levelId === this.eLevelId) : [];
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({ next: (d) => { this.departments = d; this.cdr.detectChanges(); } });
    this.programService.getPrograms().subscribe({ next: (d) => { this.programs = d; this.cdr.detectChanges(); } });
    this.cycleService.getCycles().subscribe({ next: (d) => { this.cycles = d; this.cdr.detectChanges(); } });
    this.levelService.getLevels().subscribe({ next: (d) => { this.levels = d; this.cdr.detectChanges(); } });
    this.studentService.getStudents().subscribe({ next: (d) => { this.students = d; this.cdr.detectChanges(); } });
    // TODO: this.classRoomService.getClassRooms().subscribe(...)
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.enrollmentService.getEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.filteredEnrollments = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD (pas de update)
  // ──────────────────────────────────────────────

  createEnrollment(): void {
    const payload = {
      academicYear: this.eAcademicYear,
      classRoomId: this.eClassRoomId!,
      studentId: this.eStudentId!,
    };
    this.enrollmentService.createEnrollment(payload).subscribe({
      next: () => {
        this.notificationService.success('Inscription créée', 'L\'inscription a été créée avec succès !');
        this.resetCreateForm();
        this.loadEnrollments();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de l\'inscription.');
        this.modalCreateOpen = false;
      },
    });
  }

  deleteEnrollment(): void {
    this.enrollmentService.deleteEnrollment(this.enrollmentToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Inscription supprimée', 'L\'inscription a été supprimée avec succès !');
        this.loadEnrollments();
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
  eStudentId: number | null = null;
  eAcademicYear: string = '';
  eDepartmentId: number | null = null;
  eProgramId: number | null = null;
  eCycleId: number | null = null;
  eLevelId: number | null = null;
  eClassRoomId: number | null = null;
  studentSearchQuery: string = '';

  get filteredStudentsForCreate(): StudentModel[] {
    if (!this.studentSearchQuery) return this.students;
    const q = this.studentSearchQuery.toLowerCase();
    return this.students.filter(
      (s) =>
        `${s.nom}`.toLowerCase().includes(q) ||
        s.matricule.toLowerCase().includes(q),
    );
  }

  resetCreateForm(): void {
    this.eStudentId = null; this.eAcademicYear = '';
    this.eDepartmentId = null; this.eProgramId = null; this.eCycleId = null;
    this.eLevelId = null; this.eClassRoomId = null; this.studentSearchQuery = '';
    this.filteredProgramsForCreate = []; this.filteredCyclesForCreate = [];
    this.filteredLevelsForCreate = []; this.filteredClassRoomsForCreate = [];
  }

  openModalCreate(): void { this.modalCreateOpen = true; }
  closeModalCreate(): void { this.modalCreateOpen = false; this.resetCreateForm(); }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;
  enrollmentToView: EnrollmentModel | null = null;

  openModalView(e: EnrollmentModel): void { this.enrollmentToView = e; this.modalViewOpen = true; }
  closeModalView(): void { this.modalViewOpen = false; this.enrollmentToView = null; }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  enrollmentToDelete: EnrollmentModel | null = null;

  openModalDelete(e: EnrollmentModel): void { this.enrollmentToDelete = e; this.modalDeleteOpen = true; }
  closeModalDelete(): void { this.modalDeleteOpen = false; this.enrollmentToDelete = null; }
}
