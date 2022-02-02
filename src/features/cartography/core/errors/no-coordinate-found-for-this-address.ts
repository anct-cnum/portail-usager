export class NoCoordinateFoundForThisAddress extends Error {
  public constructor(public readonly address: string) {
    super(`No coordinates found for the address: ${address}`);
  }
}
