import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [CommonModule, RouterModule, FormsModule, SvgIconComponent, ButtonComponent],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit{

  email:string='';
  password:string='';
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
    if(this.email && this.password){
      // TODO: implement login logic
      console.log('Login attempt:', this.email, this.password);
    }
  }

  get f(){
    return ;
  }

}