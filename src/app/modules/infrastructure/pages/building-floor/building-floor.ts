import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-building-floor',
  imports: [CommonModule],
  templateUrl: './building-floor.html',
  styleUrl: './building-floor.scss',
})
export class BuildingFloor {
  activeTab: 'building' | 'floor' = 'building';

  setActiveTab(tab: 'building' | 'floor'): void {
    this.activeTab = tab;
  }
}
