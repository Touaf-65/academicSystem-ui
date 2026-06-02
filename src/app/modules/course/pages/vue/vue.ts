import { Component } from '@angular/core';
import { PieChartComponent } from '../../../common/charts/pie-chart/pie-chart';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [PieChartComponent],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue {}
