# ⚠️  SECURITY INCIDENT RESPONSE - SUPABASE KEY ROTATION

## Incident: SUPABASE_SERVICE_ROLE_KEY Leaked to GitHub
**Date:** 2026-02-23
**Status:** IN PROGRESS

## Immediate Actions Required

### 1. Supabase Dashboard (MANUAL - User must do this NOW)
- [ ] Log in to https://app.supabase.io
- [ ] Select project: bscpro
- [ ] Go to: Project Settings → API
- [ ] Generate NEW Service Role Key
- [ ] REVOKE old key immediately
- [ ] Copy new key

### 2. Update Environment Variables

#### Local Machine (.env.local):
```bash
# Edit .env.local and replace:
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_KEY_HERE
```

#### Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select bscpro project
3. Go to Settings → Environment Variables
4. Delete old SUPABASE_SERVICE_ROLE_KEY
5. Add new key with same name
6. Redeploy

### 3. Git History Cleanup

#### Install BFG Repo-Cleaner:
```bash
# On local machine:
brew install bfg  # macOS
# OR
cd /tmp && wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
```

#### Create passwords.txt:
```bash
# Create file with OLD leaked key:
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXBwaWVyZ3BhZ21reG94ZHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTYxNzg1NSwiZXhwIjoyMDg3MTkzODU1fQ.Zx0bSf9yXbpMJNek6ZPNL9gtN233yB-7JScUMGrdZCI" > passwords.txt
```

#### Run BFG:
```bash
# Clone mirror of repo
git clone --mirror git@github.com:username/bscpro.git

# Run BFG to remove passwords
cd bscpro.git
java -jar /tmp/bfg-1.14.0.jar --replace-text passwords.txt

# Clean up
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Force push (DESTRUCTIVE!)
git push --force
```

#### Alternative: git filter-repo:
```bash
# Install filter-repo
pip install git-filter-repo

# Run filter
git filter-repo --replace-text <(echo "OLD_KEY==>NEW_KEY")

# Force push
git push origin --force --all
```

### 4. Verify Cleanup

Check if key is still in history:
```bash
git log --all --full-history -p -- .env.local | grep "OLD_KEY"
```

If nothing shows up: ✅ SUCCESS

### 5. Additional Security Measures

- [ ] Enable 2FA on GitHub account
- [ ] Enable 2FA on Supabase account
- [ ] Review GitHub access logs
- [ ] Check Supabase query logs for unauthorized access
- [ ] Rotate all other API keys (Resend, etc.) as precaution

## Timeline

- **06:15 UTC** - Issue detected
- **06:20 UTC** - .gitignore verified correct
- **06:25 UTC** - Instructions provided
- **TBD** - Key rotation completed
- **TBD** - Git history scrubbed

## Notes

- The key was present in .env.local which was accidentally committed
- .gitignore was correctly configured but file was already tracked
- Never commit .env files to git, even in private repos
- Consider using GitHub Secret Scanning for future protection

## Contact

If you need help with the git cleanup: contact support@bscpro.nl
