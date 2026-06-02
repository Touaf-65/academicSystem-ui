import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
  
@Component({
  standalone: true,
  selector: 'app-new-password',
  imports: [CommonModule, RouterModule, SvgIconComponent, ButtonComponent],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword implements OnInit {
  
  ngOnInit() {

  }
  constructor() {
  }
}
