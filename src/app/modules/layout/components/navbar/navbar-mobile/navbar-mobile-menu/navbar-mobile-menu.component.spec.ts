import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMobileMenuComponent } from './navbar-mobile-menu.component';

describe('NavbarMobileMenuComponent', () => {
  let component: NavbarMobileMenuComponent;
  let fixture: ComponentFixture<NavbarMobileMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarMobileMenuComponent]
    });
    fixture = TestBed.createComponent(NavbarMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
