import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomModel, RoomService } from '../../services/room/room-service';
import { BuildingModel, BuildingService } from '../../services/building/building-service';
import { FloorModel, FloorService } from '../../services/floor/floor-service';

@Component({
  standalone: true,
  selector: 'app-classroom',
  imports: [ModalComponent, NotificationComponent, FormsModule, CommonModule],
  templateUrl: './classroom.html',
  styleUrl: './classroom.scss',
})
export class Classroom implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private roomService: RoomService,
    private buildingService: BuildingService,
    private floorService: FloorService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ──────────────────────────────────────────────
  // Données
  // ──────────────────────────────────────────────

  rooms: RoomModel[] = [];
  filteredRooms: RoomModel[] = [];
  buildings: BuildingModel[] = [];
  floors: FloorModel[] = [];

  // Floors filtrés selon le bâtiment sélectionné dans les filtres
  filteredFloorsForFilter: FloorModel[] = [];
  // Floors filtrés selon le bâtiment sélectionné dans la modal création
  filteredFloorsForCreate: FloorModel[] = [];
  // Floors filtrés selon le bâtiment sélectionné dans la modal édition
  filteredFloorsForEdit: FloorModel[] = [];

  readonly roomTypes: Array<'CLASSROOM' | 'AMPHI' | 'LAB'> = ['CLASSROOM', 'AMPHI', 'LAB'];

  // ──────────────────────────────────────────────
  // Filtres
  // ──────────────────────────────────────────────
  filterBuildingId: number | null = null;
  filterFloorId: number | null = null;
  filterType: string = '';
  searchQuery: string = '';

  onFilterBuildingChange(): void {
    this.filterFloorId = null;
    this.filteredFloorsForFilter = this.filterBuildingId
      ? this.floors.filter((f) => f.buildingId === this.filterBuildingId)
      : [];
    this.applyFilters();
  }

  onFilterFloorChange(): void {
    this.applyFilters();
  }

  onFilterTypeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRooms = this.rooms.filter((r) => {
      const matchBuilding = this.filterBuildingId
        ? this.getFloorById(r.floorId)?.buildingId === this.filterBuildingId
        : true;
      const matchFloor = this.filterFloorId ? r.floorId === this.filterFloorId : true;
      const matchType = this.filterType ? r.type === this.filterType : true;
      const matchSearch = this.searchQuery
        ? r.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      return matchBuilding && matchFloor && matchType && matchSearch;
    });
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  getFloorById(floorId: number): FloorModel | undefined {
    return this.floors.find((f) => f.id === floorId);
  }

  getBuildingName(floorId: number): string {
    const floor = this.getFloorById(floorId);
    if (!floor) return '—';
    const building = this.buildings.find((b) => b.id === floor.buildingId);
    return building ? building.nom : '—';
  }

  getFloorNumero(floorId: number): string {
    const floor = this.getFloorById(floorId);
    return floor ? `Étage ${floor.numero}` : '—';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      CLASSROOM: 'Salle',
      AMPHI: 'Amphi',
      LAB: 'Labo',
    };
    return labels[type] ?? type;
  }

  getTypeClass(type: string): string {
    const classes: Record<string, string> = {
      CLASSROOM: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      AMPHI: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      LAB: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    };
    return classes[type] ?? '';
  }

  // ──────────────────────────────────────────────
  // Chargements
  // ──────────────────────────────────────────────

  ngOnInit(): void {
    this.buildingService.getBuildings().subscribe({
      next: (data) => { this.buildings = data; this.cdr.detectChanges(); },
    });
    this.floorService.getFloors().subscribe({
      next: (data) => { this.floors = data; this.cdr.detectChanges(); },
    });
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.filteredRooms = data;
        this.cdr.detectChanges();
      },
    });
  }

  // ──────────────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────────────

  createRoom(): void {
    const payload = { nom: this.rNom, capacite: this.rCapacite!, floorId: this.rFloorId!, type: this.rType! };
    this.roomService.createRoom(payload).subscribe({
      next: () => {
        this.notificationService.success('Salle créée', 'La nouvelle salle a été créée avec succès !');
        this.rNom = ''; this.rCapacite = null; this.rBuildingId = null; this.rFloorId = null; this.rType = null;
        this.filteredFloorsForCreate = [];
        this.loadRooms();
        this.modalCreateOpen = false;
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création de la salle.');
        this.modalCreateOpen = false;
      },
    });
  }

  editRoom(): void {
    const payload = { nom: this.editNom, capacite: this.editCapacite!, floorId: this.editFloorId!, type: this.editType! };
    this.roomService.updateRoom(this.roomToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Salle modifiée', 'La salle a été modifiée avec succès !');
        this.loadRooms();
        this.closeModalEdit();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification de la salle.');
        this.closeModalEdit();
      },
    });
  }

  deleteRoom(): void {
    this.roomService.deleteRoom(this.roomToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Salle supprimée', 'La salle a été supprimée avec succès !');
        this.loadRooms();
        this.closeModalDelete();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression de la salle.');
        this.closeModalDelete();
      },
    });
  }

  // ──────────────────────────────────────────────
  // Modal : Créer
  // ──────────────────────────────────────────────
  modalCreateOpen = false;
  rNom: string = '';
  rCapacite: number | null = null;
  rBuildingId: number | null = null;
  rFloorId: number | null = null;
  rType: 'CLASSROOM' | 'AMPHI' | 'LAB' | null = null;

  onCreateBuildingChange(): void {
    this.rFloorId = null;
    this.filteredFloorsForCreate = this.rBuildingId
      ? this.floors.filter((f) => f.buildingId === this.rBuildingId)
      : [];
  }

  openModalCreate() { this.modalCreateOpen = true; }
  closeModalCreate() {
    this.modalCreateOpen = false;
    this.rNom = ''; this.rCapacite = null; this.rBuildingId = null; this.rFloorId = null; this.rType = null;
    this.filteredFloorsForCreate = [];
  }

  // ──────────────────────────────────────────────
  // Modal : Voir
  // ──────────────────────────────────────────────
  modalViewOpen = false;
  roomToView: RoomModel | null = null;

  openModalView(room: RoomModel) { this.roomToView = room; this.modalViewOpen = true; }
  closeModalView() { this.modalViewOpen = false; this.roomToView = null; }

  // ──────────────────────────────────────────────
  // Modal : Modifier
  // ──────────────────────────────────────────────
  modalEditOpen = false;
  roomToEdit: RoomModel | null = null;
  editNom: string = '';
  editCapacite: number | null = null;
  editBuildingId: number | null = null;
  editFloorId: number | null = null;
  editType: 'CLASSROOM' | 'AMPHI' | 'LAB' | null = null;

  onEditBuildingChange(): void {
    this.editFloorId = null;
    this.filteredFloorsForEdit = this.editBuildingId
      ? this.floors.filter((f) => f.buildingId === this.editBuildingId)
      : [];
  }

  openModalEdit(room: RoomModel) {
    this.roomToEdit = room;
    this.editNom = room.nom;
    this.editCapacite = room.capacite;
    this.editFloorId = room.floorId;
    this.editType = room.type;
    // Retrouver le bâtiment à partir de l'étage
    const floor = this.getFloorById(room.floorId);
    this.editBuildingId = floor ? floor.buildingId : null;
    this.filteredFloorsForEdit = this.editBuildingId
      ? this.floors.filter((f) => f.buildingId === this.editBuildingId)
      : [];
    this.modalEditOpen = true;
  }

  closeModalEdit() {
    this.modalEditOpen = false;
    this.roomToEdit = null;
    this.editNom = ''; this.editCapacite = null; this.editBuildingId = null; this.editFloorId = null; this.editType = null;
    this.filteredFloorsForEdit = [];
  }

  // ──────────────────────────────────────────────
  // Modal : Supprimer
  // ──────────────────────────────────────────────
  modalDeleteOpen = false;
  roomToDelete: RoomModel | null = null;

  openModalDelete(room: RoomModel) { this.roomToDelete = room; this.modalDeleteOpen = true; }
  closeModalDelete() { this.modalDeleteOpen = false; this.roomToDelete = null; }
}
