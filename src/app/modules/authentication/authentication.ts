import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Authentication implements OnInit{
  ngOnInit() {

  }
  constructor() {

  }

}


