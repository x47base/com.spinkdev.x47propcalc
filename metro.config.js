const { getDefaultConfig } = require('expo/metro-config');
const { getDefaultConfig: getRNConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const expoConfig = getDefaultConfig(__dirname);
const rnConfig = getRNConfig(__dirname);

const config = {
    ...expoConfig,
    ...rnConfig,
    resolver: {
        ...expoConfig.resolver,
        ...rnConfig.resolver,
    },
    transformer: {
        ...expoConfig.transformer,
        ...rnConfig.transformer,
    },
    serializer: {
        ...expoConfig.serializer,
        ...rnConfig.serializer,
    },
    server: {
        ...expoConfig.server,
        ...rnConfig.server,
    },
    symbolicator: {
        ...expoConfig.symbolicator,
        ...rnConfig.symbolicator,
    },
};

module.exports = withNativeWind(config, { input: './global.css' });
