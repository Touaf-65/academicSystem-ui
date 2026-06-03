import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CycleModel, CycleService } from '../../services/cycle/cycle-service';
import { ProgramModel, ProgramService } from '../../services/program/program-service';

@Component({
  standalone: true,
  selector: 'app-cycle',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './cycle.html',
  styleUrl: './cycle.scss',
})
export class Cycle implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private cycleService: CycleService,
    private programService: ProgramService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Champs création
  code: string = '';
  nom: string = '';
  dureeAnnees: number | null = null;
  programId: number | null = null;

  cycles: CycleModel[] = [];
  filteredCycles: CycleModel[] = [];
  programs: ProgramModel[] = [];

  cycleToEdit: CycleModel | null = null;
  cycleToDelete: CycleModel | null = null;
  cycleToView: CycleModel | null = null;

  ngOnInit() {
    this.loadPrograms();
    this.loadCycles();
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  loadPrograms(): void {
    this.programService.getPrograms().subscribe({
      next: (data) => {
        this.programs = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadCycles(): void {
    this.cycleService.getCycles().subscribe({
      next: (data) => {
        this.cycles = data;
        this.filteredCycles = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createCycle(): void {
    const payload = {
      code: this.code,
      nom: this.nom,
      dureeAnnees: this.dureeAnnees!,
      programId: this.programId!,
    };
    this.cycleService.createCycle(payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Cycle créé',
          'Le nouveau cycle a été créé avec succès !',
        );
        this.code = '';
        this.nom = '';
        this.dureeAnnees = null;
        this.programId = null;
        this.loadCycles();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la création du cycle.',
        );
        this.modalCreateOpen = false;
      },
    });
  }

  editCycle(): void {
    const payload = {
      code: this.editCode,
      nom: this.editNom,
      dureeAnnees: this.editDureeAnnees!,
      programId: this.editProgramId!,
    };
    this.cycleService.updateCycle(this.cycleToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success(
          'Cycle modifié',
          'Le cycle a été modifié avec succès !',
        );
        this.loadCycles();
        this.closeModalEditCycle();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la modification du cycle.',
        );
        this.closeModalEditCycle();
      },
    });
  }

  deleteCycle(): void {
    this.cycleService.deleteCycle(this.cycleToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Cycle supprimé',
          'Le cycle a été supprimé avec succès !',
        );
        this.loadCycles();
        this.closeModalDeleteCycle();
      },
      error: () => {
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la suppression du cycle.',
        );
        this.closeModalDeleteCycle();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Helper
  // ──────────────────────────────────────────────

  getProgramName(programId: number): string {
    const prog = this.programs.find((p) => p.id === programId);
    return prog ? prog.nom : '—';
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;

  openModalCreateCycle() {
    this.modalCreateOpen = true;
  }

  closeModalCreateCycle() {
    this.modalCreateOpen = false;
    this.code = '';
    this.nom = '';
    this.dureeAnnees = null;
    this.programId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;

  openModalViewCycle(cycle: CycleModel) {
    this.cycleToView = cycle;
    this.modalViewOpen = true;
  }

  closeModalViewCycle() {
    this.modalViewOpen = false;
    this.cycleToView = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  editCode: string = '';
  editNom: string = '';
  editDureeAnnees: number | null = null;
  editProgramId: number | null = null;

  openEditCycle(cycle: CycleModel) {
    this.cycleToEdit = cycle;
    this.editCode = cycle.code;
    this.editNom = cycle.nom;
    this.editDureeAnnees = cycle.dureeAnnees;
    this.editProgramId = cycle.programId;
    this.modalEditOpen = true;
  }

  closeModalEditCycle() {
    this.modalEditOpen = false;
    this.cycleToEdit = null;
    this.editCode = '';
    this.editNom = '';
    this.editDureeAnnees = null;
    this.editProgramId = null;
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  deleteError = '';

  openDeleteCycle(cycle: CycleModel) {
    this.cycleToDelete = cycle;
    this.deleteError = '';
    this.modalDeleteOpen = true;
  }

  closeModalDeleteCycle() {
    this.modalDeleteOpen = false;
    this.cycleToDelete = null;
    this.deleteError = '';
  }
}
