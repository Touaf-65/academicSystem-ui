import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, RouterModule, SvgIconComponent, ButtonComponent],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp implements OnInit{

  email:string='';
  password:string='';
  lastname:string='';
  firstname:string='';
  submitted=false;
  passwordTextType!: boolean;
  ngOnInit() {

  }
  constructor() {
  }
  togglePasswordTextType(){
    this.passwordTextType= !this.passwordTextType;
  }

  onSubmit(){
    this.submitted=true;
  }

  get f(){
    return ;
  }

}