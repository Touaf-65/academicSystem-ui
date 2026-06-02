import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  SimpleChanges,
  effect,
} from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { ChartOptions } from '../../../../shared/models/chart-options';

import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  standalone: true,
  selector: 'app-column-chart',
  imports: [NgApexchartsModule                                                                                                                                                ],
  templateUrl: './column-chart.html',
  styleUrls: ['./column-chart.scss'],
})
export class ColumnChartComponent implements OnInit, OnDestroy {
  @Input() series: any[] | null = null;
  public chartOptions: ChartOptions;
  constructor(private themeService: ThemeService) {
    let baseColor = '#FFFFFF';

    this.chartOptions = {
      colors: ['#1A56DB', '#FDBA8C'],
      series: this.series ?? [
        {
          name: 'Assures Principaux',
          data: [231, 122, 63, 421],
        },
        // {
        //   name: 'Assures conjoints',
        //   data: [232, 113, 341, 224],
        // },
        // {
        //   name: 'Assures enfants',
        //   data: [230, 110, 335, 214],
        // },
      ],
      chart: {
        type: 'bar',
        height: '220px',
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '80%',
          borderRadiusApplication: 'around',
          borderRadius: 10,
        },
      },
      tooltip: {
        shared: true,
        intersect: true,
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
          },
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -14,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      xaxis: {
        floating: false,
        labels: {
          show: true,
          style: {
            fontFamily: 'Inter, sans-serif',
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        show: true,
      },
      fill: {
        opacity: 1,
      },
      title: null,
      theme: null,
      annotations: null,
      markers: null,
      responsive: null,
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor, '#00E396', '#0090FF'];
    });
  }

  private HSLToHex(color: string): string {
    const colorArray = color.split('%').join('').split(' ');
    const colorHSL = colorArray.map(Number);
    const hsl = {
      h: colorHSL[0],
      s: colorHSL[1],
      l: colorHSL[2],
    };

    const { h, s, l } = hsl;

    const hDecimal = l / 100;
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

      // Convert to Hex and prefix with "0" if required
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series) {
      this.chartOptions.series = this.series;
    }
  }

  ngOnDestroy(): void {}
  generateDayWiseTimeSeries(s: any, count: any) {
    var values = [
      [4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
      [2, 3, 8, 7, 22, 16, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, 6, 2],
    ];
    var i = 0;
    var series = [];
    var x = new Date('11 Nov 2012').getTime();
    while (i < count) {
      series.push([x, values[s][i]]);
      x += 86400000;
      i++;
    }
    return series;
  }
}


