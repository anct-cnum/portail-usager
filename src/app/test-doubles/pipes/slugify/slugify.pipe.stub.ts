import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slugify' })
export class SlugifyStubPipe implements PipeTransform {
  public transform(): string {
    return '';
  }
}
