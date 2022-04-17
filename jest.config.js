module.exports = {
  transform: {
    "^.+.ts?$": "ts-jest",
  },
  coverageReporters: ["html", "lcov", "text-summary"],
  collectCoverageFrom: ["<rootDir>/server/**/*.ts"],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/test-reports",
  testEnvironment: "node",
};
