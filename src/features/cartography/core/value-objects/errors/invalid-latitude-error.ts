export class InvalidLatitudeError extends Error {
  public constructor(public readonly latitude: number) {
    super(`La latitude doit être comprise entre -90 et 90 degrés. Valeur : ${latitude}`);
  }
}
