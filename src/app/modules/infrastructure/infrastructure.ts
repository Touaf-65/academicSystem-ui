import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-infrastructure',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './infrastructure.html',
  styleUrl: './infrastructure.scss',
})
export class Infrastructure {}
