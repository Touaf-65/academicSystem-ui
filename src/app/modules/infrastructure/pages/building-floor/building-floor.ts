import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuildingModel, BuildingService } from '../../services/building/building-service';
import { FloorModel, FloorService } from '../../services/floor/floor-service';

@Component({
  standalone: true,
  selector: 'app-building-floor',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './building-floor.html',
  styleUrl: './building-floor.scss',
})
export class BuildingFloor implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private buildingService: BuildingService,
    private floorService: FloorService,
    private cdr: ChangeDetectorRef,
  ) {}

  activeTab: 'building' | 'floor' = 'building';

  setActiveTab(tab: 'building' | 'floor'): void {
    this.activeTab = tab;
  }

  // ════════════════════════════════════════
  // BUILDINGS
  // ════════════════════════════════════════

  buildings: BuildingModel[] = [];
  filteredBuildings: BuildingModel[] = [];

  buildingToEdit: BuildingModel | null = null;
  buildingToDelete: BuildingModel | null = null;
  buildingToView: BuildingModel | null = null;

  // Champs création bâtiment
  bDescription: string = '';
  bNom: string = '';
  bCapaciteTotale: number | null = null;

  // Champs édition bâtiment
  editBDescription: string = '';
  editBNom: string = '';
  editBCapaciteTotale: number | null = null;

  loadBuildings(): void {
    this.buildingService.getBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
        this.filteredBuildings = data;
        this.cdr.detectChanges();
      },
    });
  }

  createBuilding(): void {
    const payload = { description: this.bDescription, nom: this.bNom, capaciteTotale: this.bCapaciteTotale! };
    this.buildingService.createBuilding(payload).subscribe({
      next: () => {
        this.notificationService.success('Bâtiment créé', 'Le nouveau bâtiment a été créé avec succès !');
        this.bDescription = ''; this.bNom = ''; this.bCapaciteTotale = null;
        this.loadBuildings();
        this.modalBuildingCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création du bâtiment.');
        this.modalBuildingCreateOpen = false;
      },
    });
  }

  editBuilding(): void {
    const payload = { description: this.editBDescription, nom: this.editBNom, capaciteTotale: this.editBCapaciteTotale! };
    this.buildingService.updateBuilding(this.buildingToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Bâtiment modifié', 'Le bâtiment a été modifié avec succès !');
        this.loadBuildings();
        this.closeModalEditBuilding();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification du bâtiment.');
        this.closeModalEditBuilding();
      },
    });
  }

  deleteBuilding(): void {
    this.buildingService.deleteBuilding(this.buildingToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Bâtiment supprimé', 'Le bâtiment a été supprimé avec succès !');
        this.loadBuildings();
        this.closeModalDeleteBuilding();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression du bâtiment.');
        this.closeModalDeleteBuilding();
      },
    });
  }

  // Modals Building
  modalBuildingCreateOpen = false;
  openModalCreateBuilding() { this.modalBuildingCreateOpen = true; }
  closeModalCreateBuilding() {
    this.modalBuildingCreateOpen = false;
    this.bDescription = ''; this.bNom = ''; this.bCapaciteTotale = null;
  }

  modalBuildingViewOpen = false;
  openModalViewBuilding(b: BuildingModel) { this.buildingToView = b; this.modalBuildingViewOpen = true; }
  closeModalViewBuilding() { this.modalBuildingViewOpen = false; this.buildingToView = null; }

  modalBuildingEditOpen = false;
  openEditBuilding(b: BuildingModel) {
    this.buildingToEdit = b;
    this.editBDescription = b.description; this.editBNom = b.nom; this.editBCapaciteTotale = b.capaciteTotale;
    this.modalBuildingEditOpen = true;
  }
  closeModalEditBuilding() {
    this.modalBuildingEditOpen = false;
    this.buildingToEdit = null;
    this.editBDescription = ''; this.editBNom = ''; this.editBCapaciteTotale = null;
  }

  modalBuildingDeleteOpen = false;
  openDeleteBuilding(b: BuildingModel) { this.buildingToDelete = b; this.modalBuildingDeleteOpen = true; }
  closeModalDeleteBuilding() { this.modalBuildingDeleteOpen = false; this.buildingToDelete = null; }

  // ════════════════════════════════════════
  // FLOORS
  // ════════════════════════════════════════

  floors: FloorModel[] = [];
  filteredFloors: FloorModel[] = [];

  floorToEdit: FloorModel | null = null;
  floorToDelete: FloorModel | null = null;
  floorToView: FloorModel | null = null;

  // Champs création étage
  fNumero: number | null = null;
  fCapacite: number | null = null;
  fBuildingId: number | null = null;

  // Champs édition étage
  editFNumero: number | null = null;
  editFCapacite: number | null = null;
  editFBuildingId: number | null = null;

  getBuildingName(buildingId: number): string {
    const b = this.buildings.find((b) => b.id === buildingId);
    return b ? b.nom : '—';
  }

  loadFloors(): void {
    this.floorService.getFloors().subscribe({
      next: (data) => {
        this.floors = data;
        this.filteredFloors = data;
        this.cdr.detectChanges();
      },
    });
  }

  createFloor(): void {
    const payload = { numero: this.fNumero!, capacite: this.fCapacite!, buildingId: this.fBuildingId! };
    this.floorService.createFloor(payload).subscribe({
      next: () => {
        this.notificationService.success('Étage créé', 'Le nouvel étage a été créé avec succès !');
        this.fNumero = null; this.fCapacite = null; this.fBuildingId = null;
        this.loadFloors();
        this.modalFloorCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création de l\'étage.');
        this.modalFloorCreateOpen = false;
      },
    });
  }

  editFloor(): void {
    const payload = { numero: this.editFNumero!, capacite: this.editFCapacite!, buildingId: this.editFBuildingId! };
    this.floorService.updateFloor(this.floorToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Étage modifié', 'L\'étage a été modifié avec succès !');
        this.loadFloors();
        this.closeModalEditFloor();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification de l\'étage.');
        this.closeModalEditFloor();
      },
    });
  }

  deleteFloor(): void {
    this.floorService.deleteFloor(this.floorToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Étage supprimé', 'L\'étage a été supprimé avec succès !');
        this.loadFloors();
        this.closeModalDeleteFloor();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression de l\'étage.');
        this.closeModalDeleteFloor();
      },
    });
  }

  // Modals Floor
  modalFloorCreateOpen = false;
  openModalCreateFloor() { this.modalFloorCreateOpen = true; }
  closeModalCreateFloor() {
    this.modalFloorCreateOpen = false;
    this.fNumero = null; this.fCapacite = null; this.fBuildingId = null;
  }

  modalFloorViewOpen = false;
  openModalViewFloor(f: FloorModel) { this.floorToView = f; this.modalFloorViewOpen = true; }
  closeModalViewFloor() { this.modalFloorViewOpen = false; this.floorToView = null; }

  modalFloorEditOpen = false;
  openEditFloor(f: FloorModel) {
    this.floorToEdit = f;
    this.editFNumero = f.numero; this.editFCapacite = f.capacite; this.editFBuildingId = f.buildingId;
    this.modalFloorEditOpen = true;
  }
  closeModalEditFloor() {
    this.modalFloorEditOpen = false;
    this.floorToEdit = null;
    this.editFNumero = null; this.editFCapacite = null; this.editFBuildingId = null;
  }

  modalFloorDeleteOpen = false;
  openDeleteFloor(f: FloorModel) { this.floorToDelete = f; this.modalFloorDeleteOpen = true; }
  closeModalDeleteFloor() { this.modalFloorDeleteOpen = false; this.floorToDelete = null; }

  // ════════════════════════════════════════
  // Init
  // ════════════════════════════════════════

  ngOnInit() {
    this.loadBuildings();
    this.loadFloors();
  }
}
