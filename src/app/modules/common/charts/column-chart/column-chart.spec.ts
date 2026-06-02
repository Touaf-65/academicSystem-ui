import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChart } from './column-chart';

describe('ColumnChart', () => {
  let component: ColumnChart;
  let fixture: ComponentFixture<ColumnChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
