import { SlugifyPipe } from './slugify.pipe';

describe('slugify pipe', (): void => {
  it('should transform any value to string', (): void => {
    const input: number = 4;

    const output: string = new SlugifyPipe().transform(input as unknown as string);

    expect(output).toBe('4');
  });

  it('should transform upper case to lower case', (): void => {
    const input: string = 'Hello-World';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hello-world');
  });

  it('should replace all spaces with dashes', (): void => {
    const input: string = 'Hello World';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hello-world');
  });

  it('should remove all non word chars', (): void => {
    const input: string = 'Hell* W*rld';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hell-wrld');
  });

  it('should remove duplicate dashes', (): void => {
    const input: string = 'Hello--World';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hello-world');
  });

  it('should remove starting dash', (): void => {
    const input: string = '-Hello-World';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hello-world');
  });

  it('should remove ending dash', (): void => {
    const input: string = 'Hello-World-';

    const output: string = new SlugifyPipe().transform(input);

    expect(output).toBe('hello-world');
  });
});
