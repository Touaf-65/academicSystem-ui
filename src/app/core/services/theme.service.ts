
import {effect, Injectable, signal} from '@angular/core';
import {Theme} from "../models/theme.model";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme= signal<Theme>({ mode:'dark', color:'base'});

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setTheme();
    });
  }

  loadTheme(){
    const theme= localStorage.getItem('theme');
    if(theme){
      this.theme.set(JSON.parse(theme));
    }
  }

  setTheme(){
    localStorage.setItem('theme',JSON.stringify(this.theme()));
    this.setThemeClass();
  }
  get isDark():boolean{
    return this.theme().mode=='dark'
  }

  setThemeClass(){
    document.querySelector('html')!.className= this.theme().mode;
    document.querySelector('html')!.setAttribute('data-theme',this.theme().color)
  }
}
