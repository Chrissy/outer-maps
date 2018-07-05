import path from "path";
import url from "url";

const __dirname = path.dirname(new url.URL(import.meta.url).pathname);

export default {
  entry: "./components/app.js",
  output: {
    path: path.normalize(__dirname + "/public/dist"),
    filename: "bundle.js"
  },
  module: {
    noParse: /(mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.(js|mjs|svg)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "es2015", "react"],
            plugins: ["transform-object-rest-spread"]
          }
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.css$/,
        loader:
          "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
      },
      {
        test: /\.svg$/,
        loaders: ["svg-to-jsx-loader"]
      }
    ]
  }
};
