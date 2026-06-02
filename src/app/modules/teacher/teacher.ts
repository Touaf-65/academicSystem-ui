import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-teacher',
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.scss',
})
export class Teacher {}
