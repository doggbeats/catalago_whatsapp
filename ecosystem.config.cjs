// Configuração do PM2 para o Catálogo ELECTRICS
// Uso no VPS:
//   cp .env.example .env   (e preencha os valores)
//   npm ci
//   npm run build
//   pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: "catalogo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p " + (process.env.PORT || 3000),
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};