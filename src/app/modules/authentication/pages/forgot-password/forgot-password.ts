import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {
  ngOnInit() {

  }
  constructor() {
  }

}
