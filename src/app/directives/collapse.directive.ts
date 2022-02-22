import { ChangeDetectorRef, Directive, ElementRef, HostBinding, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '.fr-collapse-v--content'
})
export class CollapseDirective implements OnInit, OnDestroy {
  private _resizeObserver?: ResizeObserver;

  @HostBinding('style.margin-top') public marginTop: string = '-1000px';

  public constructor(private readonly host: ElementRef, private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnDestroy(): void {
    this._resizeObserver?.unobserve(this.host.nativeElement as HTMLElement);
    this._resizeObserver?.disconnect();
  }

  public ngOnInit(): void {
    this._resizeObserver = new ResizeObserver((): void => {
      const marginTop: string = `-${(this.host.nativeElement as HTMLElement).offsetHeight.toString()}px`;
      if (marginTop === this.marginTop) return;
      this.marginTop = marginTop;
      this.changeDetectorRef.detectChanges();
    });

    this._resizeObserver.observe(this.host.nativeElement as HTMLElement);
  }
}
