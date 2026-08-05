/** Pure engine Jest (no jest-expo / reanimated — those hang in this environment). */
module.exports = {
  testEnvironment: 'node',
  watchman: false,
  forceExit: true,
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/unit/**/*.test.ts', '**/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/component/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  transform: {
    '^.+\\.tsx?$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
};
