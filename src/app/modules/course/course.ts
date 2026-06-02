import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-course',
  imports: [CommonModule, RouterModule],
  templateUrl: './course.html',
  styleUrl: './course.scss',
})
export class Course {}
