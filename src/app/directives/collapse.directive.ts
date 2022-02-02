import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '.fr-collapse-v--content'
})
export class CollapseDirective {
  @HostBinding('style.margin-top') public marginTop: string = '-1000px';

  public constructor(private readonly host: ElementRef) {
    new ResizeObserver((): void => {
      const marginTop: string = `-${(host.nativeElement as HTMLElement).offsetHeight.toString()}px`;
      if (marginTop === this.marginTop) return;
      this.marginTop = marginTop;
    }).observe(host.nativeElement as HTMLElement);
  }
}
