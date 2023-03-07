const path = require("path");


module.exports = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
        "stream": require.resolve("stream-browserify"),
        "timers": require.resolve("timers-browserify"),
        "zlib": false,
        "crypto": false,
        "http": false,
        "dgram": false
      }
    }
    return config
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles/")],
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  },
  
};
