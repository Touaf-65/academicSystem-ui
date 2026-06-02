
import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsive-helper',
  templateUrl: './responsive-helper.component.html',
  styleUrls: ['./responsive-helper.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ResponsiveHelperComponent implements OnInit{


  public env:any='environment';
  constructor() {
  }
  ngOnInit(){

  }

}
