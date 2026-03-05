#!/bin/bash

echo "=========================================="
echo "🔒 BSC PRO Security Audit Script"
echo "Datum: $(date)"
echo "=========================================="
echo ""

# Kleuren voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "1️⃣  Systeem Updates"
echo "=================="
if [ -f /var/lib/apt/periodic/update-success-stamp ]; then
    LAST_UPDATE=$(stat -c %y /var/lib/apt/periodic/update-success-stamp 2>/dev/null || echo "onbekend")
    echo "Laatste update check: $LAST_UPDATE"
else
    echo -e "${YELLOW}⚠️  Waarschuwing: Geen recente update check gevonden${NC}"
fi

echo ""
echo "2️⃣  Firewall Status (UFW)"
echo "========================="
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | head -1)
    if echo "$UFW_STATUS" | grep -q "Status: active"; then
        echo -e "${GREEN}✅ Firewall is ACTIEF${NC}"
        echo "Open poorten:"
        sudo ufw status | grep -E "(ALLOW|DENY)"
    else
        echo -e "${RED}🚨 KRITIEK: Firewall is INACTIEF${NC}"
    fi
else
    echo -e "${RED}🚨 KRITIEK: UFW niet geïnstalleerd${NC}"
fi

echo ""
echo "3️⃣  SSH Configuratie"
echo "===================="
if [ -f /etc/ssh/sshd_config ]; then
    ROOT_LOGIN=$(grep -E "^PermitRootLogin" /etc/ssh/sshd_config | awk '{print $2}')
    PASSWORD_AUTH=$(grep -E "^PasswordAuthentication" /etc/ssh/sshd_config | awk '{print $2}')
    SSH_PORT=$(grep -E "^Port" /etc/ssh/sshd_config | awk '{print $2}')
    
    echo "SSH Poort: ${SSH_PORT:-22} (standaard is 22)"
    
    if [ "$ROOT_LOGIN" == "no" ] || [ "$ROOT_LOGIN" == "prohibit-password" ]; then
        echo -e "${GREEN}✅ Root login is uitgeschakeld${NC}"
    else
        echo -e "${YELLOW}⚠️  Root login is mogelijk ingeschakeld${NC}"
    fi
    
    if [ "$PASSWORD_AUTH" == "no" ]; then
        echo -e "${GREEN}✅ Wachtwoord authenticatie is uitgeschakeld (alleen SSH keys)${NC}"
    else
        echo -e "${YELLOW}⚠️  Wachtwoord authenticatie is ingeschakeld${NC}"
    fi
else
    echo "SSH configuratie niet gevonden"
fi

echo ""
echo "4️⃣  Fail2Ban Status"
echo "==================="
if command -v fail2ban-client &> /dev/null; then
    FAIL2BAN_STATUS=$(sudo systemctl is-active fail2ban 2>/dev/null)
    if [ "$FAIL2BAN_STATUS" == "active" ]; then
        echo -e "${GREEN}✅ Fail2Ban is actief${NC}"
        echo "Geblokkeerde IP's:"
        sudo fail2ban-client status sshd 2>/dev/null | grep "Banned IP list" || echo "Geen IP's geblokkeerd"
    else
        echo -e "${RED}🚨 Fail2Ban is niet actief${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Fail2Ban niet geïnstalleerd${NC}"
fi

echo ""
echo "5️⃣  API Keys & Environment Variables"
echo "======================================"
ENV_FILES=$(find /home -name ".env" 2>/dev/null | head -5)
if [ ! -z "$ENV_FILES" ]; then
    echo "Gevonden .env bestanden:"
    for file in $ENV_FILES; do
        PERMS=$(stat -c "%a %n" "$file" 2>/dev/null)
        OWNER=$(stat -c "%U" "$file" 2>/dev/null)
        if [ -f "$file" ]; then
            if [ "$(stat -c "%a" "$file" 2>/dev/null)" == "600" ]; then
                echo -e "${GREEN}✅ $file (permissies: $PERMS, owner: $OWNER)${NC}"
            else
                echo -e "${YELLOW}⚠️  $file (permissies: $PERMS) - Zouden 600 moeten zijn${NC}"
            fi
        fi
    done
else
    echo "Geen .env bestanden gevonden in /home"
fi

echo ""
echo "6️⃣  Check op Gevoelige Bestanden in Git"
echo "========================================"
if command -v git &> /dev/null; then
    REPOS=$(find /home -name ".git" -type d 2>/dev/null | head -5)
    for repo in $REPOS; do
        REPO_DIR=$(dirname "$repo")
        echo "Repository: $REPO_DIR"
        cd "$REPO_DIR"
        
        # Check voor .env files in git history
        if git log --all --full-history --source --name-only --pretty=format: | grep -q "\.env"; then
            echo -e "${RED}🚨 WAARSCHUWING: .env bestanden gevonden in git history!${NC}"
            echo "   Dit is een SERIEUS beveiligingsrisico!"
        else
            echo -e "${GREEN}✅ Geen .env bestanden in git history${NC}"
        fi
        
        # Check voor API keys in recente commits
        if git log --oneline -10 --grep="key" --grep="api" --all-match 2>/dev/null | head -3; then
            echo -e "${YELLOW}⚠️  Commits gevonden die mogelijk keys bevatten${NC}"
        fi
    done
else
    echo "Git niet geïnstalleerd"
fi

echo ""
echo "7️⃣  Running Services"
echo "===================="
echo "Actieve services op poorten:"
sudo ss -tulpn 2>/dev/null | grep LISTEN | grep -v "127.0.0.1" || netstat -tulpn 2>/dev/null | grep LISTEN | head -10

echo ""
echo "8️⃣  Disk Gebruik & Logs"
echo "======================="
echo "Disk gebruik:"
df -h / | tail -1

echo ""
echo "Recente authenticatie pogingen (laatste 10):"
if [ -f /var/log/auth.log ]; then
    sudo tail -10 /var/log/auth.log 2>/dev/null | grep -E "(Failed|Accepted)"
else
    echo "Auth log niet toegankelijk"
fi

echo ""
echo "=========================================="
echo "📋 SAMENVATTING"
echo "=========================================="
echo ""
echo "Prioriteit 1 (Fix onmiddellijk):"
echo "  - Firewall activeren (als uit)"
echo "  - .env files rechten naar 600"
echo "  - API keys uit git history verwijderen (als aanwezig)"
echo ""
echo "Prioriteit 2 (Deze week):"
echo "  - Fail2Ban installeren/activeren"
echo "  - SSH op niet-standaard poort (optioneel)"
echo "  - Automatische updates configureren"
echo ""
echo "Prioriteit 3 (Maandelijks):"
echo "  - Systeem updates draaien"
echo "  - Logs checken op verdachte activiteit"
echo "  - Backups testen"
echo ""
echo "Audit voltooid: $(date)"
