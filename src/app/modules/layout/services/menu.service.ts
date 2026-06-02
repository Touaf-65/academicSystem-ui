
import {Injectable, OnDestroy, signal} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MenuItem, SubMenuItem} from "../../../core/models/menu.model";
import {Menu} from "../../../core/constants/menu";

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnDestroy{

  _showSidebar= signal(true);
  _showMobileMenu=signal(false);
  _pagesMenu=signal<MenuItem[]>([]);
  _subscription= new Subscription();
  constructor(private router:Router) {
    this._pagesMenu.set(Menu.pages);
    let sub =this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        this._pagesMenu().forEach((menu)=>{
          let activeGroup= false;
          menu.items.forEach((subMenu)=>{
            const active = this.isActive(subMenu.route);
            subMenu.expanded= active;
            subMenu.active= active;
            if(active) activeGroup= true;
            if(subMenu.children){
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }
  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu(){
    return this._showMobileMenu();
  }
  get pagesMenu(){
    return this._pagesMenu();
  }

  set showSideBar(value:boolean){
    this._showSidebar.set(value);
  }

  set showMobileMenu(value:boolean){
    this._showMobileMenu.set(value);
  }

  toggleSidebar(){
    this._showSidebar.set(!this._showSidebar());
  }
  toggleMenu(menu:any){
    this.showSideBar= true;
    menu.expanded = !menu.expanded;
  }

  expand(items:Array<any>){
    items.forEach((item)=>{
      item.expanded = this.isActive(item.route);
      if(item.children) this.expand(item.children)
    })
  }

  isActive(instruction: any){
    return this.router.isActive(this.router.createUrlTree([instruction]),{
      paths:'subset',
      queryParams:'subset',
      fragment:'ignored',
      matrixParams:'ignored'
    });
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }
}
