import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  @ViewChild('container') public container!: ElementRef<HTMLElement>;

  @Input() public expanded: boolean = false;

  @Input() public label: string = '';

  @ViewChild('menuControl') public menuControl!: ElementRef<HTMLElement>;

  private clickOnMenuControl(clickEvent: Event): boolean {
    return clickEvent.target === this.menuControl.nativeElement;
  }

  private clickOnMenuItem(clickEvent: Event): boolean {
    return this.container.nativeElement.contains(clickEvent.target as Node);
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }

  @HostListener('document:click', ['$event']) public onClickOutside(clickEvent: Event): void {
    if (!this.expanded || this.clickOnMenuControl(clickEvent) || this.clickOnMenuItem(clickEvent)) return;
    this.expanded = false;
  }

  @HostListener('keydown.escape') public onEscape(): void {
    this.expanded = false;
    this.menuControl.nativeElement.focus();
  }
}
