
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill, ApexGrid,
  ApexLegend, ApexMarkers, ApexPlotOptions, ApexResponsive, ApexStates,
  ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip,
  ApexXAxis, ApexYAxis
} from "ng-apexcharts";

export type ChartOptions={
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  stroke: ApexStroke;
  xaxis:ApexXAxis | null;
  yaxis: ApexYAxis | ApexYAxis[] | null;
  states: ApexStates;
  tooltip: ApexTooltip | null;
  colors: string[];
  grid: ApexGrid;
  title: ApexTitleSubtitle | null;
  theme: ApexTheme | null;
  annotations: ApexAnnotations | null;
  responsive: ApexResponsive[] | null;
  plotOptions: ApexPlotOptions;
  markers: ApexMarkers | null
}
