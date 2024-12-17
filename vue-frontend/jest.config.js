module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!vuetify).+\\.js$'
    ],
  };