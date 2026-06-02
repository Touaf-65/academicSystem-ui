import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  effect,
} from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { ChartOptions } from '../../../../shared/models/chart-options';

import {
  NgApexchartsModule,
} from 'ng-apexcharts';

@Component({
  standalone: true,
  selector: 'app-line-chart',
  imports: [NgApexchartsModule],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.scss'],
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() series: { name: string; data: number[] }[] | null = null;
  @Input() categories: string[] | null = null;

  public chartOptions: ChartOptions;

  constructor(private themeService: ThemeService) {
    let baseColor = '#FFFFFF';

    this.chartOptions = {
      chart: {
        type: 'area',
        height: 250,
        foreColor: '#999',
        stacked: true,
        dropShadow: {
          enabled: true,
          top: -2,
          left: 2,
          blur: 5,
          opacity: 0.06,
        },
      },
      colors: ['#00E396'],
      // colors: ['#00E396', '#0090FF', '#FF4D00', '#FFFF00'],
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      dataLabels: {
        enabled: false,
      },
      series: this.series ?? [
        {
          name: 'Total Views',
          data: this.generateDayWiseTimeSeries(0, 18),
        },
        // {
        //   name: 'Unique Views',
        //   data: this.generateDayWiseTimeSeries(1, 18),
        // },
        // {
        //   name: 'Total Views',
        //   data: this.generateDayWiseTimeSeries(0, 18),
        // },
        // {
        //   name: 'Unique Views',
        //   data: this.generateDayWiseTimeSeries(1, 18),
        // },
        // {
        //   name: 'Unique Views',
        //   data: this.generateDayWiseTimeSeries(1, 18),
        // },
      ],
      markers: {
        size: 0,
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: this.categories ?? [],
        // type: "datetime",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4,
          },
        },
      },
      yaxis: {
        labels: {
          offsetX: 14,
          offsetY: -5,
        },
        tooltip: {
          enabled: true,
        },
      },
      grid: {
        padding: {
          left: -5,
          right: 5,
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val + '$';
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
          },
        },
      },
      title: {},
      theme: {},
      annotations: {},
      responsive: [],
      plotOptions: {},
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor, '#00E396', '#0090FF', '#FF4D00', '#FFFF00'];
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

  ngOnInit(): void {
    console.log(this.series);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.series) {
      this.chartOptions.series = this.series;
    }
    if (this.categories) {
      this.chartOptions.xaxis = {
        ...this.chartOptions.xaxis,
        categories: this.categories,
      };
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
