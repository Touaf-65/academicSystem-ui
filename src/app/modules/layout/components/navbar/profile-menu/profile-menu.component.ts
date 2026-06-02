
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ThemeService} from "../../../../../core/services/theme.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { SvgIconComponent } from 'angular-svg-icon';
@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective, SvgIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit{
  public isOpen= false;
  public profileMenu=[
    {
      title: 'Your Profile',
      icon: '/assets/icons/heroicons/outline/user-circle.svg',
      link: 'dashboard/profile',
    },
    {
      title: 'Log out',
      icon: '/assets/icons/heroicons/outline/logout.svg',
      link: '/auth',
    },
  ];
  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },

    {
      name: 'red',
      code: '#cc0022',
    },
  ];
  public themeMode = ['light', 'dark'];
  ngOnInit() {

  }
  constructor(public themeService:ThemeService) {
  }

  toggleMenu():void{
    this.isOpen= !this.isOpen;
  }
  toggleThemeMode(){
    this.themeService.theme.update((theme)=>{
      const mode= !this.themeService.isDark ? 'dark' : 'light';
      return {...theme, mode:mode};
    });
  }
  toggleThemeColor(color:string){
    this.themeService.theme.update((theme)=>{
      return {...theme, color: color};
    });
  }
}
