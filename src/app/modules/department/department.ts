import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department {}
