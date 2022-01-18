import { Pipe, PipeTransform } from '@angular/core';

const ANY_NON_WORD_CHAR: RegExp = /[^\w-]+/gu;

const ANY_WHITE_SPACES: RegExp = /\s+/gu;

const DOUBLE_DASH: RegExp = /--+/gu;

const STARTING_DASH: RegExp = /^-+/u;

const ENDING_DASH: RegExp = /-+$/u;

const SLUG_SEPARATOR: string = '-';

const EMPTY_STRING: string = '';

const slugify = (input: string): string =>
  input
    .toString()
    .toLowerCase()
    .replace(ANY_WHITE_SPACES, SLUG_SEPARATOR)
    .replace(ANY_NON_WORD_CHAR, EMPTY_STRING)
    .replace(DOUBLE_DASH, SLUG_SEPARATOR)
    .replace(STARTING_DASH, EMPTY_STRING)
    .replace(ENDING_DASH, EMPTY_STRING);

@Pipe({ name: 'slugify' })
export class SlugifyPipe implements PipeTransform {
  public transform(input: string): string {
    return slugify(input);
  }
}
