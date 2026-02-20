// Expo app configuration (web only)
module.exports = {
  expo: {
    name: "PACE DAO",
    slug: "pace-dao",
    version: "1.0.0",
    scheme: "pacedao",
    userInterfaceStyle: "light",
    extra: {
      privyAppId: process.env.EXPO_PUBLIC_PRIVY_APP_ID,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      paceTokenAddress: process.env.EXPO_PUBLIC_PACE_TOKEN_ADDRESS,
      paceRewardsAddress: process.env.EXPO_PUBLIC_PACE_REWARDS_ADDRESS,
      chainId: process.env.EXPO_PUBLIC_CHAIN_ID,
      rpcUrl: process.env.EXPO_PUBLIC_RPC_URL,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
