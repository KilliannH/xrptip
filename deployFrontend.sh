#!/bin/bash

###############################################################################
# Script de déploiement automatique du frontend xrpTip
# Usage: ./deploy-frontend.sh
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="xrptip-frontend"
CLOUDFRONT_DISTRIBUTION_ID="E2JVZWLCZBVE0Y"  # À remplir après création CloudFront

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  xrpTip - Déploiement Frontend${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis le dossier frontend${NC}"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env.production manquant${NC}"
    echo -e "${YELLOW}Création du fichier...${NC}"
    cat > .env.production << EOF
VITE_API_URL=https://api.xrptip.com/api
VITE_APP_NAME=xrpTip
EOF
    echo -e "${GREEN}✅ .env.production créé${NC}"
    echo ""
fi

# Display current config
echo -e "${BLUE}📋 Configuration:${NC}"
echo "   S3 Bucket: $S3_BUCKET"
echo "   CloudFront ID: ${CLOUDFRONT_DISTRIBUTION_ID:-Non configuré}"
echo ""

# Ask confirmation
read -p "Continuer le déploiement? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Déploiement annulé${NC}"
    exit 0
fi

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install --force
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# Step 2: Build
echo -e "${BLUE}🔨 Build du frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Build terminé${NC}"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erreur: Le dossier dist/ n'existe pas${NC}"
    exit 1
fi

# Step 3: Upload to S3
echo -e "${BLUE}☁️  Upload vers S3...${NC}"
aws s3 sync dist/ s3://$S3_BUCKET/ --delete

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Upload S3 terminé${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'upload S3${NC}"
    exit 1
fi
echo ""

# Step 4: Invalidate CloudFront cache (if configured)
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}🔄 Invalidation du cache CloudFront...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Cache CloudFront invalidé${NC}"
    else
        echo -e "${YELLOW}⚠️  Erreur lors de l'invalidation du cache${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  CloudFront ID non configuré - cache non invalidé${NC}"
    echo -e "${YELLOW}   Éditer ce script et définir CLOUDFRONT_DISTRIBUTION_ID${NC}"
fi
echo ""

# Step 5: Verify deployment
echo -e "${BLUE}🔍 Vérification du déploiement...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://xrptip.com)

if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ https://xrptip.com répond correctement${NC}"
else
    echo -e "${YELLOW}⚠️  https://xrptip.com répond avec le code $RESPONSE${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Déploiement terminé !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Résumé:${NC}"
echo "   • Build: ✅"
echo "   • Upload S3: ✅"
echo "   • Cache CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID:+✅}"
echo "   • Vérification: ${RESPONSE:+✅}"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo "   • Frontend: https://xrptip.com"
echo "   • API: https://api.xrptip.com"
echo ""
echo -e "${YELLOW}💡 Note: Si les changements ne sont pas visibles immédiatement,${NC}"
echo -e "${YELLOW}   attendre 5-10 minutes pour la propagation du cache CloudFront.${NC}"
echo ""