module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/presenter/**/*.js',
    'integration-tests/*.test.js',
    '!integration-tests/journey/*.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    window: true,
  },
  // this is to ignore imported html files
  testEnvironment: 'node',
  transform: {
    '^.+\\.html?$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
  // TODO: remove 'e2e/**/*.js' - this is including e2e tests in our global coverage %
  // TODO: add in '!src/**/*.test.js' - this is including unit tests in our global coverage %
  verbose: true,
};
