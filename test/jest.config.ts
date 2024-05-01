const BaseConfig = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'test/coverage/',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.module.ts',
    'main.ts',
    '.interface.ts',
    '.error.ts',
    '.enum.ts',
    '.dto.ts',
    '.input.ts',
    '.output.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json'
      }
    ]
  },
  // setupFiles: ['reflect-metadata'],
  globalSetup: '<rootDir>/test/e2e/setup.ts',
  globalTeardown: '<rootDir>/test/e2e/teardown.ts',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  preset: 'ts-jest',
  rootDir: '../',
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  testEnvironment: 'node',
  testRegex: '.(spec|e2e).ts$',
  verbose: true,
  workerIdleMemoryLimit: '7168MB'
}

export default BaseConfig
