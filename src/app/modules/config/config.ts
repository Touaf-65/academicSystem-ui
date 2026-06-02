import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-config',
  imports: [CommonModule, RouterModule],
  templateUrl: './config.html',
  styleUrl: './config.scss',
})
export class Config {}
