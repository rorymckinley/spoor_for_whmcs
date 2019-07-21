'use strict'

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'production',
  entry: [
    './vue_src/app.js',
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      }
    ]
  },
  output: {
    path: __dirname + '/modules/addons/spoor/templates/js',
    filename: 'vue.js'
  },
  plugins: [
    new VueLoaderPlugin()
  ],
}
