# Deploy Memoria to Digital Ocean

## Option 1: App Platform (Easiest)

### 1. Create a Digital Ocean Account
Go to [digitalocean.com](https://digitalocean.com) and sign up.

### 2. Create a PostgreSQL Database
1. Go to **Databases** → **Create Database Cluster**
2. Choose **PostgreSQL** (version 15+)
3. Select your region and plan ($15/month for basic)
4. Wait for it to provision (~5 minutes)
5. Copy the **Connection String** from the database overview

### 3. Deploy the App
1. Go to **Apps** → **Create App**
2. Choose **GitHub** as the source
3. Select repository: `ashwannasleep/memoria`
4. Branch: `main`

### 4. Configure Build Settings
- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `5000`

### 5. Set Environment Variables
In the App settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string from step 2 |
| `SESSION_SECRET` | Generate a random 32+ character string |
| `NODE_ENV` | `production` |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret (optional) |

### 6. Configure Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID**
5. Add authorized redirect URI: `https://your-app-name.ondigitalocean.app/api/auth/google/callback`
6. Copy Client ID and Secret to your environment variables

### 7. Initialize Database
After first deployment, the database tables will be created automatically when the app starts.

---

## Option 2: Droplet (Manual Server)

### 1. Create a Droplet
- Ubuntu 22.04 LTS
- Basic plan ($6-12/month)
- Enable SSH

### 2. SSH into your server
```bash
ssh root@your-droplet-ip
```

### 3. Install dependencies
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb memoria
sudo -u postgres psql -c "CREATE USER memoria WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE memoria TO memoria;"
```

### 4. Clone and setup app
```bash
git clone https://github.com/ashwannasleep/memoria.git
cd memoria
npm install
```

### 5. Create environment file
```bash
cat > .env << EOF
DATABASE_URL=postgresql://memoria:your-password@localhost:5432/memoria
SESSION_SECRET=your-random-secret-here
NODE_ENV=production
PORT=5000
EOF
```

### 6. Build and run
```bash
npm run build
npm start
```

### 7. Setup process manager (keeps app running)
```bash
npm install -g pm2
pm2 start dist/index.cjs --name memoria
pm2 save
pm2 startup
```

### 8. Setup Nginx reverse proxy
```bash
sudo apt-get install -y nginx

sudo cat > /etc/nginx/sites-available/memoria << EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/memoria /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Setup SSL (free with Let's Encrypt)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Estimated Costs

| Service | Cost |
|---------|------|
| App Platform (Basic) | $5/month |
| PostgreSQL (Basic) | $15/month |
| **Total** | **$20/month** |

Or with Droplet:
| Service | Cost |
|---------|------|
| Droplet (Basic) | $6/month |
| Managed PostgreSQL | $15/month |
| **Total** | **$21/month** |

Note: You can run PostgreSQL on the same Droplet to save the $15/month database cost.
