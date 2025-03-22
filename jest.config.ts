import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // SVG?react 파일은 mock 파일로 매핑
    "^@/(.*)\\.svg\\?react$": "<rootDir>/__mocks__/svgReactMock.js",
    // PNG, JPG 등 이미지 파일들은 fileMock으로 처리
    "^.+\\.(png|jpg|jpeg|gif|webp)$": "<rootDir>/__mocks__/fileMock.js",
    // 나머지 alias는 기존처럼 매핑
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "<rootDir>/tsconfig.json",
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              // ts-jest-mock-import-meta 패키지 사용
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_URL: "http://localhost:3001",
                  },
                },
              },
            },
          ],
        },
      },
    ],
    "^.+\\.svg\\?react$": "<rootDir>/svgTransform.js",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFiles: ["<rootDir>/src/polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
