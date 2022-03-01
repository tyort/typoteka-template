/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: `ts-jest`,
  testEnvironment: `node`,
  collectCoverage: false,
  coverageDirectory: `coverage`,
  collectCoverageFrom: [`src/**/*.{js, ts}`],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    'src/(.*)': [`node_modules`, `src`],
  }
};
