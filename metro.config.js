const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require('expo/metro-config');

// Use the default Expo Metro config
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './app/global.css' });
