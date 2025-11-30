const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts, 'woff2'],
};

module.exports = config;
