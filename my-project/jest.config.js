module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'routes/**/*.js',
      'server.js',
      'db.js'
    ],
    testMatch: ['**/_tests_/**/*.test.js'],
  };
  