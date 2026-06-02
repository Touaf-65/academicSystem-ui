import { AfterViewInit, Component, ViewChild, effect } from '@angular/core';
import { SweepDirection } from 'igniteui-angular-core';
import { IgxRadialGaugeComponent } from 'igniteui-angular-gauges';
import { IgxRadialGaugeRangeComponent } from 'igniteui-angular-gauges';
import { RadialGaugeBackingShape } from 'igniteui-angular-gauges';
import { RadialGaugeNeedleShape } from 'igniteui-angular-gauges';
import { RadialGaugePivotShape } from 'igniteui-angular-gauges';
import { RadialGaugeScaleOversweepShape } from 'igniteui-angular-gauges';

import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';

@Component({
  standalone: true,
  selector: 'app-gauge-chart',
  imports: [IgxRadialGaugeModule],
  templateUrl: './gauge-chart.html',
  styleUrls: ['./gauge-chart.scss'],
})
export class GaugeChartComponent implements AfterViewInit {
  @ViewChild('radialGauge', { static: true })
  public radialGauge?: IgxRadialGaugeComponent;

  private shouldAnimate: boolean = true;

  public ngAfterViewInit(): void {
    this.animateToGauge3();
  }

  public animateToGauge3(): void {
    this.configureGauge(0, 50, 25, 180, 0, '#79797a', '#d6d6d6', '#fcfcfc', [
      '#F86232',
      '#DC3F76',
      '#7446B9',
    ]);
  }

  private configureGauge(
    minValue: number,
    maxValue: number,
    value: number,
    scaleStartAngle: number,
    scaleEndAngle: number,
    needleBrush: string,
    backingOutline: string,
    backingBrush: string,
    rangeBrushes: string[],
  ): void {
    if (this.shouldAnimate) {
      this.radialGauge!.transitionDuration = 700;
    }

    this.radialGauge!.height = '380px';
    this.radialGauge!.width = '100%';
    this.radialGauge!.minimumValue = minValue;
    this.radialGauge!.maximumValue = maxValue;
    this.radialGauge!.value = value;
    this.radialGauge!.interval = 5;

    // Label Settings
    this.radialGauge!.labelInterval = 10;
    this.radialGauge!.labelExtent = 0.71;
    this.radialGauge!.font = '10px Verdana,Arial';

    // Needle Settings
    this.radialGauge!.isNeedleDraggingEnabled = false;
    this.radialGauge!.needleShape = RadialGaugeNeedleShape.Triangle;
    this.radialGauge!.needleEndExtent = 0.5;
    this.radialGauge!.needleBrush = needleBrush;
    this.radialGauge!.needleOutline = needleBrush;
    this.radialGauge!.needlePivotShape = RadialGaugePivotShape.CircleOverlay;
    this.radialGauge!.needlePivotWidthRatio = 0.15;

    // Scale Settings
    this.radialGauge!.scaleStartAngle = scaleStartAngle;
    this.radialGauge!.scaleEndAngle = scaleEndAngle;
    this.radialGauge!.scaleBrush = '#d6d6d6';
    this.radialGauge!.scaleOversweepShape = RadialGaugeScaleOversweepShape.Fitted;
    this.radialGauge!.scaleSweepDirection = SweepDirection.Clockwise;
    this.radialGauge!.scaleEndExtent = 0.57;
    this.radialGauge!.scaleStartExtent = 0.5;

    // Backing Settings
    this.radialGauge!.backingBrush = backingBrush;
    this.radialGauge!.backingOutline = backingOutline;
    this.radialGauge!.backingShape = RadialGaugeBackingShape.Fitted;

    // Custom gauge ranges
    this.radialGauge!.ranges.clear();
    rangeBrushes.forEach((brush, index) => {
      const range = new IgxRadialGaugeRangeComponent();
      range.startValue = index * 10 + 5; // Example logic for start values
      range.endValue = (index + 1) * 10 + 5; // Example logic for end values
      this.radialGauge!.ranges.add(range);
    });

    // Setting extent of all gauge ranges
    for (let i = 0; i < this.radialGauge!.ranges.count; i++) {
      const range = this.radialGauge!.ranges.item(i);
      range.innerStartExtent = 0.5;
      range.innerEndExtent = 0.5;
      range.outerStartExtent = 0.58;
      range.outerEndExtent = 0.57;
    }

    this.shouldAnimate = true;

    effect(() => {
      /** change chart theme */
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      primaryColor = this.HSLToHex(primaryColor);
      // this.radialGauge!.tooltip = {
      //   theme: this.themeService.theme().mode,
      // };
      this.radialGauge!.scaleBrush = primaryColor;
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
}
