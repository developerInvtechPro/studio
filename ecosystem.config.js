module.exports = {
  apps: [
    {
      name: 'bcpos',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
