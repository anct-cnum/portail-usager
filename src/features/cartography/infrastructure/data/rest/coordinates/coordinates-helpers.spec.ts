import { capturePostalCode } from './coordinates-helpers';

describe('capturePostalCode coordinates helper', (): void => {
  it('should return hasPostalCode at false if no postal code present in the query', (): void => {
    const addressString: string = '18 Avenue des Canuts, Poitiers';

    expect(capturePostalCode(addressString).hasPostalCode).toBe(false);
  });

  it('should return the postal code (5 consecutive digits) if present', (): void => {
    const addressString: string = '18 Avenue des Canuts, 69120';

    expect(capturePostalCode(addressString).capturedPostalCode).toBe('69120');
  });
});
