
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {SubMenuItem} from "../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarSubmenuComponent } from '../sidebar-submenu/sidebar-submenu.component';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarSubmenuComponent, SvgIconComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarMenuComponent implements OnInit{

  ngOnInit() {

  }
  constructor(public  menuService:MenuService) {

  }
  toggleMenu(subMenu:SubMenuItem){
    this.menuService.toggleMenu(subMenu);
  }
}
