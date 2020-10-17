const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '../service-worker'),
  entry: './index.ts',
  output: {
    // The service worker needs to be at the root scope or it can't intercept
    // all network requests.
    filename: 'service-worker.js',
    path: path.resolve(__dirname, '../'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false, // Don't unecessarily mangle the source.
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/i,
        loader: 'json5-loader',
        options: {
          esModule: false,
        },
        type: 'javascript/auto',
      },
    ],
  },
  target: 'webworker',
  externals: {
    // Stubs out `import 'typescript'` so it returns a global.
    typescript: 'ts',
  },
  plugins: [
    // And import it at the top of the service worker script so the global is defined
    new webpack.BannerPlugin({
      banner: "importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/3.9.5/typescript.js');\n\n\n",
      raw: true,
    })
  ]
}
