module.exports = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}', 
    '!**/*.d.ts', 
    '!**/index.ts', 
    '!**/_document.tsx', 
    '!**/node_modules/**',
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
