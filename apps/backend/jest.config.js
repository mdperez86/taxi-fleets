module.exports = {
  displayName: 'backend',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageDirectory: '../../coverage/apps/backend',
  collectCoverageFrom: [
    '**/*.ts', 
    '!**/node_modules/**',
    '!src/environments/**',
    '!src/app/domain/**',
    '!src/app/app.module.ts',
    '!src/main.ts',
  ],
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
