module.exports = {
  setupFiles: ["raf/polyfill", "<rootDir>/tests/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  moduleFileExtensions: ["js", "jsx"],
  modulePaths: [
    "<rootDir>/node_modules/",
    "<rootDir>/node_modules/jest-meteor-stubs/lib/"
  ],
  moduleNameMapper: {
    "meteor/(.*)": "<rootDir>/tests/mocks/$1.js",
    "^(.*):(.*)$": "$1_$2"
  },
  unmockedModulePathPatterns: ["/^imports\\/.*\\.jsx?$/", "/^node_modules/"]
};
