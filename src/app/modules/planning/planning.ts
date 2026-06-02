import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-planning',
  imports: [CommonModule, RouterModule],
  templateUrl: './planning.html',
  styleUrl: './planning.scss',
})
export class Planning {}
