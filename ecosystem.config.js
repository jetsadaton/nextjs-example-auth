module.exports = {
  apps: [
    {
      name: 'nextjs-example',
      script: 'npm',
      args: 'start',
      interpreter: 'node@20.13.1', // Use Node.js version 20 explicitly
      env: {
        NODE_ENV: 'production' // Set to 'development' for local dev
      },
      cwd: './' // Specify the working directory if needed
    }
  ]
};