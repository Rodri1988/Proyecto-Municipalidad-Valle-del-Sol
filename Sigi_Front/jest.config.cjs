/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/test/styleMock.js',
    '^.+/config/api(\\.js)?$': '<rootDir>/src/test/apiMock.js',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/*.test.{js,jsx}'],
};
