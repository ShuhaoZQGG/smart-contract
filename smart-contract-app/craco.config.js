module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Optimize bundle splitting
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor code splitting
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Supabase client in separate chunk
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Lexical editor in separate chunk
            lexical: {
              test: /[\\/]node_modules[\\/](@lexical|lexical)[\\/]/,
              name: 'lexical',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Common code
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Tree shaking optimizations
      webpackConfig.optimization.usedExports = true;
      webpackConfig.optimization.sideEffects = false;

      return webpackConfig;
    },
  },
};