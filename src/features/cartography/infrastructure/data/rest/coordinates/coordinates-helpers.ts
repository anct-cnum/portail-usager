import { PostalCodeRegexResult } from './coordinates.rest';

export const capturePostalCode = (addressString: string): PostalCodeRegexResult => {
  const capturePostalCodeRegex: RegExp = /(?<postalCode>[0-9]{5})/u;
  const capturedGroups: RegExpExecArray | null = capturePostalCodeRegex.exec(addressString);
  return {
    capturedPostalCode: capturedGroups?.groups?.['postalCode'] ?? '',
    hasPostalCode: capturedGroups !== null
  };
};
