module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
        alias: {
          Components: "./dist/Components",
          Utils: "./dist/Utils",
          Services: "./dist/Services",
          Screens: "./dist/Screens",
          Constants: "./dist/Constants",
          Actions: "./dist/Actions",
          AppAnalytics: "./dist/AppAnalytics",
          Themes: "./dist/Themes",
        },
      },
    ], 'react-native-reanimated/plugin',
  ],
};
