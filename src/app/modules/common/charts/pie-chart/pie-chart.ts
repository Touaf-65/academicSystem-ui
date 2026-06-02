import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  SimpleChanges,
  effect,
} from '@angular/core';
import {ThemeService} from '../../../../core/services/theme.service';
import {ChartOptions} from '../../../../shared/models/chart-options';

import {
  NgApexchartsModule,
} from 'ng-apexcharts';


@Component({
  standalone: true,
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.scss'],
  imports: [NgApexchartsModule],
})
export class PieChartComponent implements OnInit, OnDestroy {
  @Input() seriesConsumption: number[] = [9, 3];

  public chartOptions: ChartOptions;

  constructor(private themeService: ThemeService) {
    let baseColor = '#FFFFFF';

    this.chartOptions = {
      series: this.seriesConsumption,
      chart: {
        width: 270,
        height: 270,
        type: 'pie',
        toolbar: {
          show: true,
        },
      },
      grid: {
        padding: {
          top: 5,
          // right:4,
          left: -25,
        },
      },
      stroke: {
        colors: ['transparent'],
        lineCap: 'square',
      },
      colors: ['#1A56DB', '#00FFFFFF'],
      plotOptions: {
        pie: {
          customScale: 1,
          dataLabels: {
            offset: -25,
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      },
      fill: {
        type: 'solid',
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
        formatter: function (val, opts) {
          if (opts.w.globals.series[opts.seriesIndex] === 1) {
            return 'Percentage Used';
          } else {
            return 'Percentage Unused';
          }
          // return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          breakpoint: 300,
          options: {
            chart: {
              width: 80,
            },
          },
        },
      ],
      states: {
        hover: {
          filter: {
            type: 'darken',
          },
        },
      },
      xaxis: null,
      yaxis: null,
      tooltip: null,
      title: null,
      theme: null,
      annotations: null,
      markers: null,
    };

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor, '#808080'];
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
    if (changes['seriesConsumption'] && this.seriesConsumption) {
      this.chartOptions.series = this.seriesConsumption;
    }
  }

  ngOnDestroy(): void {}
}
