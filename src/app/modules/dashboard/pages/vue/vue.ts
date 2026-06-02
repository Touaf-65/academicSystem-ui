import { Component } from '@angular/core';
import { PieChartComponent } from '../../../common/charts/pie-chart/pie-chart';
import { LineChartComponent} from '../../../common/charts/line-chart/line-chart';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [PieChartComponent, LineChartComponent],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue {}
