import { Component } from '@angular/core';
import { ColumnChartComponent } from '../../../common/charts/column-chart/column-chart';
import { PieChartComponent } from '../../../common/charts/pie-chart/pie-chart';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [ColumnChartComponent, PieChartComponent],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue {}
