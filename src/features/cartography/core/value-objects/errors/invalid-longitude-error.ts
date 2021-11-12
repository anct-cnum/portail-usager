export class InvalidLongitudeError extends Error {
  public constructor(public readonly longitude: number) {
    super(`La longitude doit être comprise entre -180 et 180 degrés. Valeur : ${longitude}`);
  }
}
