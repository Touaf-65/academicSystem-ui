import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentModel, StudentService } from '../../services/student/student-service';
import { ClassModel, ClassService } from '../../../department/services/class/class-service';

@Component({
  standalone: true,
  selector: 'app-student',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './student.html',
  styleUrl: './student.scss',
})
export class Student implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private studentService: StudentService,
    private classService: ClassService,
    private cdr: ChangeDetectorRef,
  ) {}

  // --- Champs création (firstName + lastName fusionnés en nom à l'envoi) ---
  createFirstName: string = '';
  createLastName: string = '';
  createEmail: string = '';
  createMatricule: string = '';
  createGender: 'M' | 'F' = 'M';
  createDateNaissance: string = '';
  createAcademicYear: string = '';
  createPassword: string = '';
  createClassId: number | null = null;

  // --- Données ---
  students: StudentModel[] = [];
  filteredStudents: StudentModel[] = [];
  classes: ClassModel[] = [];

  // --- Filtres ---
  searchQuery: string = '';
  filterClassId: number | string = '';
  filterAcademicYear: string = '';

  studentToEdit: StudentModel | null = null;
  studentToDelete: StudentModel | null = null;

  ngOnInit() {
    this.loadStudents();
    this.loadClasses();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = data;
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
    this.filteredStudents = this.students.filter((s) => {
      const matchSearch =
        !query ||
        s.nom.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query);

      const matchClass =
        !this.filterClassId || s.classId === Number(this.filterClassId);

      const matchYear =
        !this.filterAcademicYear || s.academicYear === this.filterAcademicYear;

      return matchSearch && matchClass && matchYear;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterClassId = '';
    this.filterAcademicYear = '';
    this.filteredStudents = [...this.students];
  }

  // Années académiques disponibles déduites des données
  get availableYears(): string[] {
    return [...new Set(this.students.map((s) => s.academicYear))].sort();
  }

  getClassName(classId: number): string {
    return this.classes.find((c) => c.id === classId)?.nom ?? '-';
  }

  // --- CRUD ---
  createStudent(): void {
    const payload = {
      // nom: `${this.createFirstName} ${this.createLastName}`.trim(),
      firstName: this.createFirstName,
      lastName: this.createLastName,
      email: this.createEmail,
      gender: this.createGender,
      dateNaissance: new Date(this.createDateNaissance).toISOString().split('T')[0],
      academicYear: this.createAcademicYear,
      password: this.createPassword,
      classId: this.createClassId!,
    };
    this.studentService.createStudent(payload).subscribe({
      next: () => {
        this.notificationService.success('Étudiant créé', 'Le nouvel étudiant a été créé avec succès!');
        this.resetCreateForm();
        this.loadStudents();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', "Une erreur est survenue lors de la création de l'étudiant.");
        this.modalCreateOpen = false;
      },
    });
  }

  editStudent(): void {
    const payload = {
      nom: this.editNom,
      email: this.editEmail,
      matricule: this.editMatricule,
      gender: this.editGender,
      dateNaissance: new Date(this.editDateNaissance),
      academicYear: this.editAcademicYear,
      password: this.editPassword,
      classId: this.editClassId!,
    };
    this.studentService.updateStudent(this.studentToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Étudiant modifié', "L'étudiant a été modifié avec succès!");
        this.loadStudents();
        this.closeModalEditStudent();
      },
      error: () => {
        this.notificationService.error('Erreur', "Une erreur est survenue lors de la modification de l'étudiant.");
        this.closeModalEditStudent();
      },
    });
  }

  deleteStudent(): void {
    this.studentService.deleteStudent(this.studentToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Étudiant supprimé', "L'étudiant a été supprimé avec succès!");
        this.loadStudents();
        this.closeModalDeleteStudent();
      },
      error: () => {
        this.notificationService.error('Erreur', "Une erreur est survenue lors de la suppression de l'étudiant.");
        this.closeModalDeleteStudent();
      },
    });
  }

  // --- Create modal ---
  modalCreateOpen = false;
  openModalCreateStudent() { this.modalCreateOpen = true; }
  closeModalCreateStudent() {
    this.modalCreateOpen = false;
    this.resetCreateForm();
  }
  resetCreateForm() {
    this.createFirstName = '';
    this.createLastName = '';
    this.createEmail = '';
    this.createMatricule = '';
    this.createGender = 'M';
    this.createDateNaissance = '';
    this.createAcademicYear = '';
    this.createPassword = '';
    this.createClassId = null;
  }

  // --- View modal ---
  modalViewOpen = false;
  selectedStudent: StudentModel | null = null;
  openModalViewStudent(student: StudentModel) {
    this.selectedStudent = student;
    this.modalViewOpen = true;
  }
  closeModalViewStudent() {
    this.modalViewOpen = false;
    this.selectedStudent = null;
  }

  // --- Edit modal ---
  modalEditOpen = false;
  editNom: string = '';
  editEmail: string = '';
  editMatricule: string = '';
  editGender: 'M' | 'F' = 'M';
  editDateNaissance: string = '';
  editAcademicYear: string = '';
  editPassword: string = '';
  editClassId: number | null = null;
  editError = '';

  openEditStudent(student: StudentModel) {
    this.modalEditOpen = true;
    this.studentToEdit = student;
    this.editNom = student.nom;
    this.editEmail = student.email;
    this.editMatricule = student.matricule;
    this.editGender = student.gender;
    this.editDateNaissance = new Date(student.dateNaissance).toISOString().split('T')[0];
    this.editAcademicYear = student.academicYear;
    this.editPassword = '';
    this.editClassId = student.classId;
    this.editError = '';
  }

  closeModalEditStudent() {
    this.modalEditOpen = false;
    this.studentToEdit = null;
    this.editNom = '';
    this.editEmail = '';
    this.editMatricule = '';
    this.editGender = 'M';
    this.editDateNaissance = '';
    this.editAcademicYear = '';
    this.editPassword = '';
    this.editClassId = null;
    this.editError = '';
  }

  // --- Delete modal ---
  modalDeleteOpen = false;
  deleteError = '';
  openDeleteStudent(student: StudentModel) {
    this.modalDeleteOpen = true;
    this.studentToDelete = student;
    this.deleteError = '';
  }
  closeModalDeleteStudent() {
    this.modalDeleteOpen = false;
    this.studentToDelete = null;
    this.deleteError = '';
  }
}
