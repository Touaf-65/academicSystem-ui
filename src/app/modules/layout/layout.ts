
import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavigationEnd, Router, Event} from "@angular/router";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent, FooterComponent, BottomNavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Layout implements OnInit{

  mainContent:HTMLElement | null =null;
  ngOnInit() {
    this.mainContent= document.getElementById('main-content');
  }
  constructor(private route:Router) {
    this.route.events.subscribe((event:Event) =>{
      if(event instanceof NavigationEnd){
        if(this.mainContent){
          this.mainContent!.scrollTop=0;
        }
      }
    });
  }
}
