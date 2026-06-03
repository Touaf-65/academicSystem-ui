import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassModel, ClassService } from '../../services/class/class-service';
import { LevelModel, LevelService } from '../../services/level/level-service';

@Component({
  standalone: true,
  selector: 'app-class',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './class.html',
  styleUrl: './class.scss',
})
export class Class implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private classroomService: ClassService,
    private levelService: LevelService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Champs création
  code: string = '';
  nom: string = '';
  capacite: number | null = null;
  levelId: number | null = null;

  classrooms: ClassModel[] = [];
  filteredClassrooms: ClassModel[] = [];
  levels: LevelModel[] = [];

  classroomToEdit: ClassModel | null = null;
  classroomToDelete: ClassModel | null = null;
  classroomToView: ClassModel | null = null;

  ngOnInit() {
    this.loadLevels();
    this.loadClasss();
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  loadLevels(): void {
    this.levelService.getLevels().subscribe({
      next: (data) => {
        this.levels = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadClasss(): void {
    this.classroomService.getClasss().subscribe({
      next: (data) => {
        this.classrooms = data;
        this.filteredClassrooms = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createClass(): void {
    const payload = {
      code: this.code,
      nom: this.nom,
      capacite: this.capacite!,
      levelId: this.levelId!,
    };
    this.classroomService.createClass(payload).subscribe({
      next: () => {
        this.notificationService.success('Classe créée', 'La nouvelle classe a été créé avec succès !');
        this.code = '';
        this.nom = '';
        this.capacite = null;
        this.levelId = null;
        this.loadClasss();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création de la classe.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editClass(): void {
    const payload = {
      code: this.editCode,
      nom: this.editNom,
      capacite: this.editCapacite!,
      levelId: this.editLevelId!,
    };
    this.classroomService.updateClass(this.classroomToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Classe modifiée', 'La classe a été modifiée avec succès !');
        this.loadClasss();
        this.closeModalEditClass();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification de la classe.',
        );
        this.closeModalEditClass();
      },
    });
  }

  deleteClass(): void {
    this.classroomService.deleteClass(this.classroomToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Classe supprimée', 'La nouvelle classe a été supprimée avec succès !');
        this.loadClasss();
        this.closeModalDeleteClass();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression de la classe.',
        );
        this.closeModalDeleteClass();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Helper
  // ──────────────────────────────────────────────

  getLevelName(levelId: number): string {
    const level = this.levels.find((p) => p.id === levelId);
    return level ? level.nom : '—';
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;

  openModalCreateClass() {
    this.modalCreateOpen = true;
  }

  closeModalCreateClass() {
    this.modalCreateOpen = false;
    this.code = '';
    this.nom = '';
    this.capacite = null;
    this.levelId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;

  openModalViewClass(classroom: ClassModel) {
    this.classroomToView = classroom;
    this.modalViewOpen = true;
  }

  closeModalViewClass() {
    this.modalViewOpen = false;
    this.classroomToView = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  editCode: string = '';
  editNom: string = '';
  editCapacite: number | null = null;
  editLevelId: number | null = null;

  openEditClass(classroom: ClassModel) {
    this.classroomToEdit = classroom;
    this.editCode = classroom.code;
    this.editNom = classroom.nom;
    this.editCapacite = classroom.capacite;
    this.editLevelId = classroom.levelId;
    this.modalEditOpen = true;
  }

  closeModalEditClass() {
    this.modalEditOpen = false;
    this.classroomToEdit = null;
    this.editCode = '';
    this.editNom = '';
    this.editCapacite = null;
    this.editLevelId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  deleteError = '';

  openDeleteClass(classroom: ClassModel) {
    this.classroomToDelete = classroom;
    this.deleteError = '';
    this.modalDeleteOpen = true;
  }

  closeModalDeleteClass() {
    this.modalDeleteOpen = false;
    this.classroomToDelete = null;
    this.deleteError = '';
  }
}
