
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../services/menu.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarMenuComponent, ProfileMenuComponent, NavbarMobileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarComponent implements OnInit{
  ngOnInit() {
  }

  constructor(private menuService:MenuService) {
  }

  toggleMobileMenu(){
    this.menuService.showMobileMenu=true;
  }
}
