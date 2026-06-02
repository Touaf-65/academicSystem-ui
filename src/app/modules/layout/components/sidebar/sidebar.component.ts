
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../services/menu.service";
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, SidebarMenuComponent, SvgIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarComponent implements OnInit{


  ngOnInit() {

  }
  constructor(public menuService:MenuService) {

  }
  appJson:any = {
    version: "0.0.0",
  };

  toggleSidebar(){
    this.menuService.toggleSidebar();
  }

}
