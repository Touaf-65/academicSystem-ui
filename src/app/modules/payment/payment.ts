import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-payment',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {}
