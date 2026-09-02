#!/usr/bin/env bash
# ============================================================
# Setup de deploy do Catálogo ELECTRICS em VPS (Ubuntu/Debian)
# Requisitos: VPS com Ubuntu 22.04+ ou Debian 12+
# Execute como root: sudo bash setup-vps.sh
# ============================================================
set -e

# ---------- Variáveis (edite aqui) ----------
APP_GIT="https://github.com/doggbeats/catalago_whatsapp.git"
APP_DIR="/var/www/catalogo-produtos"
APP_PORT="${APP_PORT:-3000}"
NODE_MAJOR=20

# Env - MODIFIQUE os valores abaixo
ADMIN_USER="${ADMIN_USER:-Login Admin}"
ADMIN_PASS="${ADMIN_PASS:-SENHA_FORTE_AQUI}"
WHATSAPP_NUMBER="${WHATSAPP_NUMBER:-5511999999999}"
PIXEL_ID="${PIXEL_ID:-941509875374620}"
domain="${domain}"

echo ">>> Instalando dependências do sistema..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y git curl ca-certificates gnupg nginx

# Node.js 20
if ! command -v node &>/dev/null; then
  echo ">>> Instalando Node.js $NODE_MAJOR..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

# PM2
if ! command -v pm2 &>/dev/null; then
  echo ">>> Instalando PM2..."
  npm install -g pm2
fi

echo ">>> Criando usuário de app..."
id -u catalogo &>/dev/null || useradd -m -s /bin/bash catalogo
mkdir -p "$APP_DIR"
chown -R catalogo:catalogo "$APP_DIR"

echo ">>> Clonando o repositório..."
if [ ! -d "$APP_DIR/.git" ]; then
  sudo -u catalogo git clone "$APP_GIT" "$APP_DIR"
fi

echo ">>> Criando arquivo .env..."
cat > "$APP_DIR/.env" <<EOF
ADMIN_USER=$ADMIN_USER
ADMIN_PASS=$ADMIN_PASS
WHATSAPP_NUMBER=$WHATSAPP_NUMBER
PIXEL_ID=$PIXEL_ID
EOF
chown catalogo:catalogo "$APP_DIR/.env"

echo ">>> Instalando dependências e fazendo build..."
cd "$APP_DIR"
sudo -u catalogo npm ci --omit=dev 2>/dev/null || sudo -u catalogo npm install
sudo -u catalogo npm run build

echo ">>> Iniciando com PM2..."
sudo -u catalogo pm2 start npm --name catalogo -- start -- -p "$APP_PORT"
pm2 startup systemd -u catalogo --hp /home/catalogo
pm2 save

echo ">>> Configurando Nginx..."
if [ -n "$domain" ]; then
  SERVER_NAME="$domain www.$domain"
else
  SERVER_NAME="_"
fi
cat > /etc/nginx/sites-available/catalogo <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sf /etc/nginx/sites-available/catalogo /etc/nginx/sites-enabled/catalogo
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "============================================================="
echo "DEPLOY CONCLUÍDO!"
echo "  Aplicação: http://127.0.0.1:$APP_PORT (via PM2)"
if [ -n "$domain" ]; then
  echo "  Site:      http://$domain"
fi
echo ""
echo "  Login admin: $ADMIN_USER"
echo "============================================================="
echo ""
echo "PARA HABILITAR HTTPS (recomendado):"
echo "  sudo apt install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d $domain"