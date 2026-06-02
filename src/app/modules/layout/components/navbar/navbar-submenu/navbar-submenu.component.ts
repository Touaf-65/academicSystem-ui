
import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SubMenuItem} from "../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
@Component({
  selector: 'app-navbar-submenu',
  templateUrl: './navbar-submenu.component.html',
  styleUrls: ['./navbar-submenu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarSubmenuComponent implements OnInit, AfterViewInit{

  @Input()
  public submenu= <SubMenuItem[]>{};
  @ViewChild('submenuRef') submenuRef:ElementRef<HTMLDivElement> | undefined
  ngOnInit() {
  }
  constructor() {
  }

  ngAfterViewInit(){
    if(this.submenuRef){
      const submenu= this.submenuRef.nativeElement.getBoundingClientRect();
      const bounding = document.body.getBoundingClientRect();

      if(submenu.right > bounding.right){
        const childrenElement = this.submenuRef.nativeElement.parentNode as HTMLElement;
        if(childrenElement){
          childrenElement.style.left= '-100%'
        }
      }
    }
  }
}
