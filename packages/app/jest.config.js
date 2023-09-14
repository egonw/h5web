const DEPS_TO_TRANSFORM = [
  'axios',
  'd3-array',
  'd3-color',
  'd3-format',
  'd3-interpolate',
  'd3-scale',
  'd3-scale-chromatic',
  'd3-time',
  'd3-time-format',
  'internmap',
];

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
const config = {
  displayName: 'app',
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  preset: 'ts-jest/presets/js-with-ts',
  resetMocks: true,
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  testRegex: '\\.test\\.tsx?$',
  transformIgnorePatterns: [
    `node_modules/\\.pnpm/(?!(${DEPS_TO_TRANSFORM.join('|')})@)`,
  ],
};

export default config;
