export class FailedToCompileError extends Error {
  public constructor(componentName: string) {
    super(`Failed to compile ${componentName} component`);
  }
}
