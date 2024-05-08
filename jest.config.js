const path = require("path");

/**
 * Jest configuration.
 *
 * @see https://jestjs.io/docs/en/configuration
 * @type {import("@jest/types").Config.InitialOptions}
 */

module.exports = {
	preset: "ts-jest",
	cacheDirectory: path.resolve(__dirname, ".cache/jest"),
	testEnvironment: "node",
	testPathIgnorePatterns: [
		"<rootDir>/.build/",
		"<rootDir>/.cache/",
		"<rootDir>/.github/",
		"<rootDir>/.husky/",
		"<rootDir>/.vscode/",
		"<rootDir>/.yarn/",
	],
	globalSetup: "<rootDir>/test/setup.ts",
};
