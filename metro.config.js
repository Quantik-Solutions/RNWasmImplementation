/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const extraNodeModules = require('node-libs-react-native');
const defaultAssetExts = require('metro-config/src/defaults/defaults')
    .assetExts;
module.exports = {
  server: {
    enableVisualizer: true
  },
  resolver: {
    extraNodeModules: {
      ...extraNodeModules,
      vm: require.resolve('vm-browserify'),
    },
    resolverMainFields: ["react-native", "main"],
    assetExts: [
      ...defaultAssetExts, // <- array spreading defaults
      'wasm',
    ]
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
