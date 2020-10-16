import {
  Directive,
  OnInit,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[backdrop]'
})
export class BackdropDirective implements OnInit {
  @Input() filters: string;
  @Input() hover: string;

  constructor(
    public el: ElementRef
  ) { }

  ngOnInit() {
    this.el.nativeElement.style.backdropFilter = this.filters;
    this.el.nativeElement.classList.add('backdropped');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backdropFilter = this.hover;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backdropFilter = this.filters;
  }
}
