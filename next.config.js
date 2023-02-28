const path = require("path");


module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles/")],
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  }
};
