import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  watchman: false,
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react" } }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/lib/style-memory.ts", "src/app/api/style/**/*.ts"],
};

export default config;
