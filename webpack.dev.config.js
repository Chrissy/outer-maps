const production = require("./webpack.production.config.js");

module.exports = Object.assign({}, production, {
  entry: "./components/app.js",
  mode: "development",
  output: {
    path: "/",
    publicPath: "http://localhost:3000/dist/",
    filename: "bundle.js",
    sourceMapFilename: "bundle.js.map"
  }
});
