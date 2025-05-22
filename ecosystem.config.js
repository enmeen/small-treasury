module.exports = {
  apps: [
    {
      name: 'small-treasury',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    }
  ]
}; 