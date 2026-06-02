
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../../../services/menu.service";
import {SubMenuItem} from "../../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMobileSubmenuComponent } from '../navbar-mobile-submenu/navbar-mobile-submenu.component';

@Component({
  selector: 'app-navbar-mobile-menu',
  templateUrl: './navbar-mobile-menu.component.html',
  styleUrls: ['./navbar-mobile-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarMobileSubmenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarMobileMenuComponent implements OnInit{

  ngOnInit() {

  }
  constructor(public  menuService:MenuService) {
  }

  public toggleMenu(subMenu: SubMenuItem){
    this.menuService.toggleMenu(subMenu)
  }
  closeMenu(){
    this.menuService.showMobileMenu=false;
  }
}
