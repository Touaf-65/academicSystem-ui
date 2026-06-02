import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vue } from './vue';

describe('Vue', () => {
  let component: Vue;
  let fixture: ComponentFixture<Vue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vue],
    }).compileComponents();

    fixture = TestBed.createComponent(Vue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
