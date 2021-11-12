module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@angular-common/(.*)': '<rootDir>/src/utils/angular-common/$1',
    '@architecture/(.*)': '<rootDir>/src/utils/architecture/$1'
  }
};
