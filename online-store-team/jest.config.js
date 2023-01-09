/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'ts'],
  transform: {
      "^.+\\.ts$": "ts-jest",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|css)$": "./test/jest/htmlLoader.js"  /////**** same with   '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': "./test/htmlLoader.js"
  }
};