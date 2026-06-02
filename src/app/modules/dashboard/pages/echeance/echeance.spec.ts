import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Echeance } from './echeance';

describe('Echeance', () => {
  let component: Echeance;
  let fixture: ComponentFixture<Echeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Echeance],
    }).compileComponents();

    fixture = TestBed.createComponent(Echeance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
