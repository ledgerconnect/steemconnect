
// Base kyt config.
// Edit these properties to make changes.

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyWebpackConfig: (baseConfig, options) => {
    // let's turn off css modules
    for (const r of baseConfig.module.rules) {
      if (r.loader) {
        r.loader = r.loader.replace('modules&', '');
      }
      if (r.use) {
        for (const u of r.use) {
          if (!u.options) continue;
          if (u.options && u.options.modules) {
            u.options.modules = false;
          }
        }
      }
    }
    return baseConfig;
  }
};
