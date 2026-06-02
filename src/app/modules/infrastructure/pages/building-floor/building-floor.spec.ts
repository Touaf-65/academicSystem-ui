import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingFloor } from './building-floor';

describe('BuildingFloor', () => {
  let component: BuildingFloor;
  let fixture: ComponentFixture<BuildingFloor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingFloor],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingFloor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
