module.exports = {
  preset: "react-native",
  automock: false,
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "\\.(ts|tsx)$": "ts-jest",
  },
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleFileExtensions: ["js", "ts", "tsx", "node", "json"],
  globals: {
    "ts-jest": {
      tsConfig: {
        jsx: "react",
      },
      diagnostics: false,
    },
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
    ".+\\.(css|style|less|sass|scss|png|jpg|ttf|woff|woff2)$": "babel-jest",
    "^Components(.*)": "<rootDir>/src/Components/$1",
    "^Utils(.*)": ["<rootDir>/src/Utils/$1"],
    "^Services(.*)": ["<rootDir>/src/Services/$1"],
    "^Screens(.*)": ["<rootDir>/src/Screens/$1"],
    "^Constants(.*)": ["<rootDir>/src/Constants/$1"],
    "^Actions(.*)": ["<rootDir>/src/Actions/$1"],
    "^AppAnalytics(.*)": ["<rootDir>/src/AppAnalytics/$1"],
    "^Themes(.*)": ["<rootDir>/src/Themes/$1"],
  },
  transformIgnorePatterns: ["node_modules/(?!(jest-)?react-native|rn|tipsi|ramda|@react|@react-native-community|react-navigation|@react-navigation|twic_mobile_components/.*)"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
};
