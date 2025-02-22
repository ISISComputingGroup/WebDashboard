import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!**/*layout.tsx",
    "!app/_app.tsx",
    "!app/components/JenkinsJobs.tsx", // relies on an external fetch
    "!app/components/ShowHideBeamInfo.tsx", // relies on an external image
    "!app/components/InstrumentData.tsx", // relies on websocket
    "!app/wall/page.tsx", // relies on JenkinsJobs
    "!app/instruments/page.tsx", // no logic here
    "!app/instrument/page.tsx", // no logic here - all in instrumentdata / instrument.ts
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
