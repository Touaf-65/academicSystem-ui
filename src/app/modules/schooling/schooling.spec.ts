import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schooling } from './schooling';

describe('Schooling', () => {
  let component: Schooling;
  let fixture: ComponentFixture<Schooling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Schooling],
    }).compileComponents();

    fixture = TestBed.createComponent(Schooling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
