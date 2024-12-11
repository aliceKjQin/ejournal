const nextJest = require('next/jest')
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Let jest recognize @ is the root dir
  },
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
     // Indicates whether the coverage information should be collected while executing the test
     collectCoverage: true,
 
     // The directory where Jest should output its coverage files
     coverageDirectory: "coverage",

  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)