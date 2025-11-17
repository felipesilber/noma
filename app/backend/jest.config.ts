import type { Config } from 'jest';
const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    modulePaths: ['<rootDir>/src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^prisma/(.*)$': '<rootDir>/src/prisma/$1',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
};
export default config;
