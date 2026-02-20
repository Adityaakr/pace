const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo Metro configuration
const config = getDefaultConfig(__dirname);

// Use persistent cache so later runs are much faster (CI mode disables this)
config.cacheVersion = '1';
config.resetCache = false;

// Enable package exports for select libraries
const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // Force uuid to use the dist/index.js (CommonJS) instead of wrapper.mjs (ESM)
  // This fixes the "Cannot read properties of undefined (reading 'v1')" error
  if (moduleName === 'uuid' || moduleName.startsWith('uuid/')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
      unstable_conditionNames: ['require', 'node'],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `isows` (a `viem`) dependency are incompatible, so they need to be disabled
  if (moduleName === "isows") {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `zustand@4` are incompatible, so they need to be disabled
  if (moduleName.startsWith("zustand")) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Package exports in `jose` are incompatible, so the browser version is used
  if (moduleName === "jose") {
    const ctx = {
      ...context,
      unstable_conditionNames: ["browser"],
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  // Enable package exports for @privy-io
  if (moduleName.startsWith('@privy-io/')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: true,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

module.exports = config;
