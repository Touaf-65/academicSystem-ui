import {AfterViewInit, Directive, ElementRef, EventEmitter, Inject, OnDestroy, Output} from '@angular/core';
import {filter, fromEvent, Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy{

  @Output()
  clickOutside= new EventEmitter<void>();
  documentClickSubscription: Subscription | undefined;

  constructor(private element: ElementRef, @Inject(DOCUMENT) private document:Document) { }

  ngAfterViewInit() {
    this.documentClickSubscription =fromEvent(this.document, 'click')
      .pipe(
        filter((event) =>{
          return !this.isInside(event.target as HTMLElement);
        }),
      ).subscribe(()=>{
        this.clickOutside.emit();
      });
  }

  ngOnDestroy() {
    this.documentClickSubscription?.unsubscribe();
  }

  isInside(elementToCheck:HTMLElement):boolean{
    return elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck);
  }

}
