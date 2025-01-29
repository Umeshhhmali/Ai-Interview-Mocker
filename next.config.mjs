// next.config.mjs
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Exclude Node.js core modules from being bundled for the client
        config.resolve.fallback = {
          ...config.resolve.fallback,
          repl: false, // Exclude 'repl' module
        };
      }
      return config;
    },
  };
  
  export default nextConfig;