module.exports = {
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],  
    setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
    testPathIgnorePatterns: ["/node_modules/"],
    coverageDirectory: "./coverage",
    collectCoverageFrom: ["src/**/*.js"]
  };