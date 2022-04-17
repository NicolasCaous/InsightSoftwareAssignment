/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  mutate: ["server/**/*.ts"],
  disableTypeChecks: "{server,test}/**/*.{js,ts,jsx,tsx,html,vue}",
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  jest: {
    projectType: "custom",
    configFile: "jest.config.js",
    enableFindRelatedTests: true,
  },
};
