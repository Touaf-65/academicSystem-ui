
import {Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MenuService} from "../../../services/menu.service";
import {SubMenuItem} from "../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-sidebar-submenu',
  templateUrl: './sidebar-submenu.component.html',
  styleUrls: ['./sidebar-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarSubmenuComponent implements OnInit{

  @Input()
  submenu=<SubMenuItem>{}
  ngOnInit() {

  }
  constructor(public menuService:MenuService) {

  }
  toggleMenu(menu:any){
    this.menuService.toggleMenu(menu);
  }

  collapse(items:Array<any>){
    items.forEach((item)=>{
      item.expanded= false;
      if(item.children) this.collapse(item.children);
    })
  }
}
