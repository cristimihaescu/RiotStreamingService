const path = require('path');

module.exports = function override(config) {
  config.resolve.fallback = {
    fs: false,
    tls: false,
    net: false,
    path: false,
    zlib: false,
    http: false,
    https: false,
    stream: require.resolve('stream-browserify')
  };
  
  return config;
}
