// craco.config.js
module.exports = {
  webpack: {
    configure: (config) => {
      if (config.module && config.module.rules) {
        // Remove any source-map-loader rules
        config.module.rules = config.module.rules.filter(rule => {
          // Remove rule with loader 'source-map-loader'
          if (rule.loader && rule.loader.includes('source-map-loader')) {
            return false;
          }
          // Remove rule with use containing 'source-map-loader'
          if (rule.use && Array.isArray(rule.use)) {
            const hasSourceMap = rule.use.some(useEntry =>
              (typeof useEntry === 'string'
                ? useEntry.includes('source-map-loader')
                : useEntry.loader && useEntry.loader.includes('source-map-loader'))
            );
            if (hasSourceMap) {
              return false;
            }
          }
          return true;
        });
        // Also remove inside oneOf arrays
        config.module.rules = config.module.rules.map(rule => {
          if (rule.oneOf) {
            rule.oneOf = rule.oneOf.filter(r => {
              // Remove nested source-map-loader rules
              if (r.loader && r.loader.includes('source-map-loader')) {
                return false;
              }
              if (r.use && Array.isArray(r.use)) {
                const hasSourceMap = r.use.some(useEntry =>
                  (typeof useEntry === 'string'
                    ? useEntry.includes('source-map-loader')
                    : useEntry.loader && useEntry.loader.includes('source-map-loader'))
                );
                if (hasSourceMap) {
                  return false;
                }
              }
              return true;
            });
          }
          return rule;
        });
      }
      return config;
    }
  }
};
