
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu/navbar-mobile-menu.component';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarMobileMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarMobileComponent implements OnInit{
  ngOnInit() {

  }
  constructor(public menuService:MenuService) {
  }
  toggleMobileMenu():void{
    this.menuService.showMobileMenu= false;
  }
}
