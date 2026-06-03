import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LevelModel, LevelService } from '../../services/level/level-service';
import { CycleModel, CycleService } from '../../services/cycle/cycle-service';

@Component({
  standalone: true,
  selector: 'app-level',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './level.html',
  styleUrl: './level.scss',
})
export class Level implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private levelService: LevelService,
    private cycleService: CycleService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Champs création
  code: string = '';
  nom: string = '';
  ordre: number | null = null;
  cycleId: number | null = null;

  levels: LevelModel[] = [];
  filteredLevels: LevelModel[] = [];
  cycles: CycleModel[] = [];

  levelToEdit: LevelModel | null = null;
  levelToDelete: LevelModel | null = null;
  levelToView: LevelModel | null = null;

  // Erreurs de validation
  createOrdreError: string = '';
  editOrdreError: string = '';

  ngOnInit() {
    this.loadCycles();
    this.loadLevels();
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  loadCycles(): void {
    this.cycleService.getCycles().subscribe({
      next: (data) => {
        this.cycles = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadLevels(): void {
    this.levelService.getLevels().subscribe({
      next: (data) => {
        this.levels = data;
        this.filteredLevels = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getCycleName(cycleId: number): string {
    const cycle = this.cycles.find((c) => c.id === cycleId);
    return cycle ? cycle.nom : '—';
  }

  getSelectedCycleDuree(cycleId: number | null): number | null {
    if (!cycleId) return null;
    const cycle = this.cycles.find((c) => c.id === cycleId);
    return cycle ? cycle.dureeAnnees : null;
  }

  // ──────────────────────────────────────────────
  // Validation ordre
  // ──────────────────────────────────────────────

  validateOrdreCreate(): boolean {
    this.createOrdreError = '';
    if (!this.cycleId) {
      this.createOrdreError = 'Veuillez sélectionner un cycle.';
      return false;
    }
    const duree = this.getSelectedCycleDuree(this.cycleId);
    if (this.ordre === null || this.ordre < 1) {
      this.createOrdreError = "L'ordre doit être supérieur ou égal à 1.";
      return false;
    }
    if (duree !== null && this.ordre > duree) {
      this.createOrdreError = `L'ordre ne peut pas dépasser la durée du cycle (${duree} an(s)).`;
      return false;
    }
    return true;
  }

  validateOrdreEdit(): boolean {
    this.editOrdreError = '';
    if (!this.editCycleId) {
      this.editOrdreError = 'Veuillez sélectionner un cycle.';
      return false;
    }
    const duree = this.getSelectedCycleDuree(this.editCycleId);
    if (this.editOrdre === null || this.editOrdre < 1) {
      this.editOrdreError = "L'ordre doit être supérieur ou égal à 1.";
      return false;
    }
    if (duree !== null && this.editOrdre > duree) {
      this.editOrdreError = `L'ordre ne peut pas dépasser la durée du cycle (${duree} an(s)).`;
      return false;
    }
    return true;
  }

  // Appelé quand le cycle change dans le formulaire création
  onCreateCycleChange(): void {
    this.ordre = null;
    this.createOrdreError = '';
  }

  // Appelé quand le cycle change dans le formulaire édition
  onEditCycleChange(): void {
    this.editOrdre = null;
    this.editOrdreError = '';
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createLevel(): void {
    if (!this.validateOrdreCreate()) return;

    const payload = {
      code: this.code,
      nom: this.nom,
      ordre: this.ordre!,
      cycleId: this.cycleId!,
    };
    this.levelService.createLevel(payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Niveau créé',
          'Le nouveau niveau a été créé avec succès !',
        );
        this.code = '';
        this.nom = '';
        this.ordre = null;
        this.cycleId = null;
        this.createOrdreError = '';
        this.loadLevels();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du niveau.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editLevel(): void {
    if (!this.validateOrdreEdit()) return;

    const payload = {
      code: this.editCode,
      nom: this.editNom,
      ordre: this.editOrdre!,
      cycleId: this.editCycleId!,
    };
    this.levelService.updateLevel(this.levelToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Niveau modifié', 'Le niveau a été modifié avec succès !');
        this.loadLevels();
        this.closeModalEditLevel();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du niveau.',
        );
        this.closeModalEditLevel();
      },
    });
  }

  deleteLevel(): void {
    this.levelService.deleteLevel(this.levelToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Niveau supprimé',
          'Le niveau a été supprimé avec succès !',
        );
        this.loadLevels();
        this.closeModalDeleteLevel();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du niveau.',
        );
        this.closeModalDeleteLevel();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;

  openModalCreateLevel() {
    this.modalCreateOpen = true;
  }

  closeModalCreateLevel() {
    this.modalCreateOpen = false;
    this.code = '';
    this.nom = '';
    this.ordre = null;
    this.cycleId = null;
    this.createOrdreError = '';
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;

  openModalViewLevel(level: LevelModel) {
    this.levelToView = level;
    this.modalViewOpen = true;
  }

  closeModalViewLevel() {
    this.modalViewOpen = false;
    this.levelToView = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  editCode: string = '';
  editNom: string = '';
  editOrdre: number | null = null;
  editCycleId: number | null = null;

  openEditLevel(level: LevelModel) {
    this.levelToEdit = level;
    this.editCode = level.code;
    this.editNom = level.nom;
    this.editOrdre = level.ordre;
    this.editCycleId = level.cycleId;
    this.editOrdreError = '';
    this.modalEditOpen = true;
  }

  closeModalEditLevel() {
    this.modalEditOpen = false;
    this.levelToEdit = null;
    this.editCode = '';
    this.editNom = '';
    this.editOrdre = null;
    this.editCycleId = null;
    this.editOrdreError = '';
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  deleteError = '';

  openDeleteLevel(level: LevelModel) {
    this.levelToDelete = level;
    this.deleteError = '';
    this.modalDeleteOpen = true;
  }

  closeModalDeleteLevel() {
    this.modalDeleteOpen = false;
    this.levelToDelete = null;
    this.deleteError = '';
  }
}
