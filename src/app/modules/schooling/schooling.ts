import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-schooling',
  imports: [CommonModule, RouterModule],
  templateUrl: './schooling.html',
  styleUrl: './schooling.scss',
})
export class Schooling {}
