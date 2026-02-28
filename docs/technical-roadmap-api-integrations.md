# Technische Roadmap: Directe API-koppeling Moneybird & Exact Online

## Doel
Gebruikers kunnen een CAMT.053 bestand direct vanuit BSC Pro naar hun Moneybird of Exact Online administratie sturen, zonder handmatige download/upload.

---

## FASE 1: Architectuur & Voorbereiding (Week 1)

### 1.1 Database Uitbreiding
```sql
-- Nieuwe tabel voor gekoppelde administraties
CREATE TABLE user_accounting_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'moneybird' | 'exact'
  admin_id VARCHAR(255),         -- Externe administratie ID
  admin_name VARCHAR(255),       -- Naam van administratie
  access_token TEXT,             -- OAuth2 access token
  refresh_token TEXT,            -- OAuth2 refresh token
  token_expires_at TIMESTAMPTZ,
  scope TEXT,                    -- Gevraagde permissies
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounting_integrations_user ON user_accounting_integrations(user_id);
CREATE INDEX idx_accounting_integrations_provider ON user_accounting_integrations(provider);

-- Transactie log voor API calls
CREATE TABLE integration_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID REFERENCES user_accounting_integrations(id),
  transaction_id UUID REFERENCES user_transactions(id),
  provider VARCHAR(50),
  status VARCHAR(50), -- 'pending' | 'success' | 'failed'
  error_message TEXT,
  external_reference VARCHAR(255), -- ID bij externe partij
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Environment Variables
```bash
# Moneybird OAuth2
MONEYBIRD_CLIENT_ID=your_moneybird_client_id
MONEYBIRD_CLIENT_SECRET=your_moneybird_client_secret
MONEYBIRD_REDIRECT_URI=https://www.bscpro.nl/api/integrations/moneybird/callback
MONEYBIRD_API_BASE=https://moneybird.com/api/v2

# Exact Online OAuth2
EXACT_CLIENT_ID=your_exact_client_id
EXACT_CLIENT_SECRET=your_exact_client_secret
EXACT_REDIRECT_URI=https://www.bscpro.nl/api/integrations/exact/callback
EXACT_API_BASE=https://start.exactonline.nl/api/v1

# Encryption for tokens
INTEGRATION_TOKEN_ENCRYPTION_KEY=your_32_char_encryption_key
```

---

## FASE 2: OAuth2 Authenticatie Flow (Week 2)

### 2.1 Generieke OAuth2 Service
```typescript
// lib/integrations/oauth-service.ts

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  scope: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export class OAuthService {
  constructor(private config: OAuthConfig) {}

  // Stap 1: Genereer authorisatie URL
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      state: state
    });
    return `${this.config.authorizationEndpoint}?${params.toString()}`;
  }

  // Stap 2: Verwissel code voor tokens
  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Stap 3: Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      })
    });

    return await response.json();
  }
}
```

### 2.2 Provider-specifieke Configuraties

**Moneybird OAuth2 Config:**
```typescript
const moneybirdConfig: OAuthConfig = {
  clientId: process.env.MONEYBIRD_CLIENT_ID!,
  clientSecret: process.env.MONEYBIRD_CLIENT_SECRET!,
  redirectUri: process.env.MONEYBIRD_REDIRECT_URI!,
  authorizationEndpoint: 'https://moneybird.com/oauth/authorize',
  tokenEndpoint: 'https://moneybird.com/oauth/token',
  scope: 'sales_invoices documents estimates time_entries settings' // Documents nodig voor bankafschriften
};
```

**Exact Online OAuth2 Config:**
```typescript
const exactConfig: OAuthConfig = {
  clientId: process.env.EXACT_CLIENT_ID!,
  clientSecret: process.env.EXACT_CLIENT_SECRET!,
  redirectUri: process.env.EXACT_REDIRECT_URI!,
  authorizationEndpoint: 'https://start.exactonline.nl/api/oauth2/auth',
  tokenEndpoint: 'https://start.exactonline.nl/api/oauth2/token',
  scope: 'crm:accounts glm:financials glm:bank glm:documents' // Bank en documents scope
};
```

---

## FASE 3: Connect & Callback Endpoints (Week 2-3)

### 3.1 Initiëer Koppeling Endpoint
```typescript
// pages/api/integrations/[provider]/connect.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { provider } = req.query;
  const userId = await getAuthenticatedUser(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Genereer state parameter voor CSRF bescherming
  const state = crypto.randomUUID();
  
  // Sla state tijdelijk op in Redis/Session (15 min expiry)
  await redis.setex(`oauth:state:${state}`, 900, JSON.stringify({
    userId,
    provider,
    timestamp: Date.now()
  }));

  // Genereer OAuth URL
  const oauthService = getOAuthService(provider as string);
  const authUrl = oauthService.getAuthorizationUrl(state);

  res.status(200).json({ authUrl, state });
}
```

### 3.2 OAuth Callback Endpoint
```typescript
// pages/api/integrations/[provider]/callback.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error } = req.query;
  const { provider } = req.query;

  if (error) {
    return res.redirect(`/dashboard/integrations?error=${error}`);
  }

  if (!code || !state) {
    return res.redirect('/dashboard/integrations?error=invalid_request');
  }

  // Valideer state parameter
  const stateData = await redis.get(`oauth:state:${state}`);
  if (!stateData) {
    return res.redirect('/dashboard/integrations?error=invalid_state');
  }

  const { userId } = JSON.parse(stateData);

  try {
    // Wissel code in voor tokens
    const oauthService = getOAuthService(provider as string);
    const tokens = await oauthService.exchangeCodeForTokens(code as string);

    // Haal administratie details op (provider-specifiek)
    const adminDetails = await fetchAdminDetails(provider as string, tokens.access_token);

    // Sla integratie op in database
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    const { error: dbError } = await supabase
      .from('user_accounting_integrations')
      .upsert({
        user_id: userId,
        provider: provider as string,
        admin_id: adminDetails.id,
        admin_name: adminDetails.name,
        access_token: encrypt(tokens.access_token),
        refresh_token: encrypt(tokens.refresh_token),
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scope: tokens.scope,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,provider'
      });

    if (dbError) throw dbError;

    // Cleanup state
    await redis.del(`oauth:state:${state}`);

    // Redirect naar succes pagina
    res.redirect(`/dashboard/integrations?success=connected&provider=${provider}`);

  } catch (err: any) {
    console.error(`[OAuth Callback] Error for ${provider}:`, err);
    res.redirect('/dashboard/integrations?error=connection_failed');
  }
}
```

---

## FASE 4: Moneybird API Implementatie (Week 3-4)

### 4.1 Moneybird Service
```typescript
// lib/integrations/moneybird-service.ts

export class MoneybirdService {
  private baseUrl = 'https://moneybird.com/api/v2';
  
  constructor(
    private accessToken: string,
    private administrationId: string
  ) {}

  // Test connectie
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.administrationId}.json`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Upload CAMT.053 als financieel document
  async uploadBankStatement(
    camt053Xml: string, 
    filename: string,
    referenceDate: string
  ): Promise<{ id: string; status: string }> {
    
    // Moneybird accepteert CAMT.053 via documenten endpoint
    const formData = new FormData();
    
    // Converteer XML string naar Blob
    const xmlBlob = new Blob([camt053Xml], { type: 'application/xml' });
    
    formData.append('document[filename]', filename);
    formData.append('document[content]', xmlBlob, filename);
    formData.append('document[document_type]', 'bank_statement');
    formData.append('document[reference_date]', referenceDate);

    const response = await fetch(
      `${this.baseUrl}/${this.administrationId}/documents.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
          // Content-Type wordt automatisch gezet door FormData
        },
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Moneybird upload failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    
    return {
      id: result.id,
      status: result.state // 'pending' | 'processed'
    };
  }

  // Poll voor verwerkingsstatus
  async getDocumentStatus(documentId: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/${this.administrationId}/documents/${documentId}.json`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch document status');
    }

    const result = await response.json();
    return result.state;
  }
}
```

### 4.2 Moneybird Endpoints
| Endpoint | Methode | Doel |
|----------|---------|------|
| `/{administration_id}.json` | GET | Verifieer administratie |
| `/documents.json` | POST | Upload CAMT.053 bestand |
| `/documents/{id}.json` | GET | Check verwerkingsstatus |
| `/financial_accounts.json` | GET | Lijst bankrekeningen |

---

## FASE 5: Exact Online API Implementatie (Week 4-5)

### 5.1 Exact Service
```typescript
// lib/integrations/exact-service.ts

export class ExactService {
  private baseUrl = 'https://start.exactonline.nl/api/v1';
  private division: string;
  
  constructor(
    private accessToken: string,
    divisionCode: string
  ) {
    this.division = divisionCode;
  }

  // Haal divisie (administratie) code op
  static async getCurrentDivision(accessToken: string): Promise<string> {
    const response = await fetch(
      'https://start.exactonline.nl/api/v1/current/Me?$select=CurrentDivision',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get division');
    }

    const data = await response.json();
    return data.d.results[0].CurrentDivision;
  }

  // Upload CAMT.053 naar Exact
  async uploadBankStatement(
    camt053Xml: string,
    filename: string,
    bankAccount: string
  ): Promise<{ id: string; status: string }> {
    
    // Exact gebruikt de BankAccountStatements endpoint
    // Eerst moeten we de XML omzetten naar Exact's formaat
    
    const requestBody = {
      BankAccount: bankAccount, // IBAN of Exact ID
      StatementDate: new Date().toISOString(),
      FileName: filename,
      FileContent: Buffer.from(camt053Xml).toString('base64'), // Base64 encoded
      ImportType: 'CAMT053' // Specificeer formaat
    };

    const response = await fetch(
      `${this.baseUrl}/${this.division}/bulk/Financial/BankAccountStatements`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Exact upload failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    
    return {
      id: result.d.ID,
      status: result.d.Status // 'Imported' | 'Processing' | 'Error'
    };
  }

  // Haal beschikbare bankrekeningen op
  async getBankAccounts(): Promise<Array<{ id: string; iban: string; description: string }>> {
    const response = await fetch(
      `${this.baseUrl}/${this.division}/bulk/Financial/BankAccounts?$select=ID,BankAccountNumber,Description`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch bank accounts');
    }

    const data = await response.json();
    
    return data.d.results.map((acc: any) => ({
      id: acc.ID,
      iban: acc.BankAccountNumber,
      description: acc.Description
    }));
  }
}
```

### 5.2 Exact Online Endpoints
| Endpoint | Methode | Doel |
|----------|---------|------|
| `/current/Me` | GET | Haal huidige divisie op |
| `/bulk/Financial/BankAccounts` | GET | Lijst bankrekeningen |
| `/bulk/Financial/BankAccountStatements` | POST | Upload CAMT.053 |
| `/bulk/Financial/BankAccountStatements` | GET | Check import status |

---

## FASE 6: Unified Upload Flow (Week 5)

### 6.1 API Endpoint voor Directe Upload
```typescript
// pages/api/integrations/upload.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await getAuthenticatedUser(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { 
    integrationId, 
    transactionIds, // Welke transacties uit BSC Pro
    bankAccount     // Optioneel: specifieke rekening
  } = req.body;

  try {
    // 1. Haal integratie details op
    const supabase = createServiceRoleClient();
    const { data: integration, error } = await supabase
      .from('user_accounting_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('user_id', userId)
      .single();

    if (error || !integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // 2. Check token expiry en refresh indien nodig
    let accessToken = decrypt(integration.access_token);
    
    if (new Date(integration.token_expires_at) < new Date()) {
      const oauthService = getOAuthService(integration.provider);
      const newTokens = await oauthService.refreshAccessToken(
        decrypt(integration.refresh_token)
      );
      
      accessToken = newTokens.access_token;
      
      // Update tokens in DB
      await supabase
        .from('user_accounting_integrations')
        .update({
          access_token: encrypt(newTokens.access_token),
          refresh_token: encrypt(newTokens.refresh_token),
          token_expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString()
        })
        .eq('id', integrationId);
    }

    // 3. Genereer CAMT.053 XML
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .in('id', transactionIds);

    const camt053Xml = generateCAMT053(transactions);

    // 4. Upload naar gekozen provider
    let uploadResult;
    
    if (integration.provider === 'moneybird') {
      const service = new MoneybirdService(accessToken, integration.admin_id);
      uploadResult = await service.uploadBankStatement(
        camt053Xml,
        `BSCPro_Export_${new Date().toISOString().split('T')[0]}.xml`,
        new Date().toISOString()
      );
      
    } else if (integration.provider === 'exact') {
      const service = new ExactService(accessToken, integration.admin_id);
      uploadResult = await service.uploadBankStatement(
        camt053Xml,
        `BSCPro_Export_${new Date().toISOString().split('T')[0]}.xml`,
        bankAccount // Exact vereist specifieke rekening
      );
    }

    // 5. Log sync
    await supabase.from('integration_sync_logs').insert({
      integration_id: integrationId,
      provider: integration.provider,
      status: 'success',
      external_reference: uploadResult?.id
    });

    res.status(200).json({
      success: true,
      documentId: uploadResult?.id,
      status: uploadResult?.status,
      message: `Bankafschrift succesvol geüpload naar ${integration.provider}`
    });

  } catch (err: any) {
    console.error('[Integration Upload] Error:', err);
    
    // Log failure
    await supabase.from('integration_sync_logs').insert({
      integration_id: integrationId,
      provider: 'unknown',
      status: 'failed',
      error_message: err.message
    });

    res.status(500).json({
      error: 'Upload failed',
      message: err.message
    });
  }
}
```

---

## FASE 7: Frontend Integratie (Week 5-6)

### 7.1 Dashboard UI Component
```typescript
// components/IntegrationUploader.tsx

export function IntegrationUploader({ transactions }: { transactions: Transaction[] }) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/integrations/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrationId: selectedIntegration,
          transactionIds: transactions.map(t => t.id)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Geüpload naar ${data.provider}!`);
      } else {
        toast.error(data.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Direct uploaden naar boekhouding</h3>
      
      {integrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Nog geen boekhouding gekoppeld</p>
          <Link href="/dashboard/integrations">
            <button className="px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold">
              Koppel Moneybird of Exact
            </button>
          </Link>
        </div>
      ) : (
        <>
          <select
            value={selectedIntegration}
            onChange={(e) => setSelectedIntegration(e.target.value)}
            className="w-full mb-4 px-4 py-2 bg-background border border-input rounded-lg"
          >
            <option value="">Kies je boekhouding...</option>
            {integrations.map(int => (
              <option key={int.id} value={int.id}>
                {int.provider === 'moneybird' ? '💚' : '💙'} {int.admin_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpload}
            disabled={!selectedIntegration || uploading}
            className="w-full py-3 bg-[#00b8d9] text-[#080d14] rounded-lg font-semibold disabled:opacity-50"
          >
            {uploading ? 'Bezig met uploaden...' : '📤 Direct uploaden'}
          </button>
        </>
      )}
    </div>
  );
}
```

---

## Implementatie Tijdlijn

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Database & Setup | Tabellen, env vars, encryptie |
| 2 | OAuth2 Flow | Auth endpoints, token management |
| 3 | Moneybird | Connectie, upload, polling |
| 4 | Exact Online | Connectie, divisies, upload |
| 5 | Unified API | Upload endpoint, error handling |
| 6 | Frontend & Polish | UI, testing, documentation |

---

## Security Consideraties

1. **Token Encryptie**: Alle tokens encrypted met AES-256 voor opslag
2. **State Parameter**: CSRF bescherming bij OAuth flow
3. **Token Refresh**: Automatische refresh voor verlopen tokens
4. **Scope Limiting**: Minimale permissies (alleen bank/document)
5. **Audit Logging**: Alle API calls gelogd in `integration_sync_logs`
6. **Rate Limiting**: Max 100 API calls per uur per integratie

---

## Benodigde OAuth2 Scopes

**Moneybird:**
- `documents` - Uploaden bankafschriften
- `settings` - Administratie details

**Exact Online:**
- `glm:financials` - Financiële transacties
- `glm:bank` - Bankrekeningen en afschriften
- `glm:documents` - Documenten uploaden

---

*Roadmap versie 1.0 - BSC Pro API Integraties*
