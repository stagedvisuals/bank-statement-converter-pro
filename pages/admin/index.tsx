import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('bscpro_admin');
      if (adminSession === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = () => {
    if (password === 'BSCPro2025!') {
      localStorage.setItem('bscpro_admin', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Onjuist wachtwoord');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#080d14'
      }}>
        <Head><title>Admin Login</title></Head>
        <div style={{
          backgroundColor: '#0f1419',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ color: 'white', marginBottom: '16px' }}>Admin Login</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Voer admin wachtwoord in</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: 'white',
              marginBottom: '16px'
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080d14', color: 'white', padding: '32px' }}>
      <Head><title>Admin Dashboard</title></Head>
      <h1>Admin Dashboard</h1>
      <p>Welkom admin! Je bent nu ingelogd.</p>
      
      <div style={{ marginTop: '32px' }}>
        <h2>Enterprise Test</h2>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/export/qbo', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'X-Admin-Secret': 'BSCPro2025!'
                },
                body: JSON.stringify({
                  transactions: [
                    { datum: '15-02-2025', omschrijving: 'Test', bedrag: -150.00, tegenpartij: 'Test' },
                  ],
                  bank: 'Test',
                  rekeningnummer: 'NL00TEST',
                  user: { bedrijfsnaam: 'Admin Test' }
                })
              });
              
              if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'test.qbo';
                a.click();
                alert('QBO export succesvol!');
              } else {
                alert('Export mislukt');
              }
            } catch (err) {
              alert('Error: ' + err);
            }
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#00b8d9',
            color: '#080d14',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test QBO Export
        </button>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('bscpro_admin');
          window.location.reload();
        }}
        style={{
          marginTop: '32px',
          padding: '12px 24px',
          backgroundColor: 'transparent',
          color: '#94a3b8',
          border: '1px solid #334155',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Uitloggen
      </button>
    </div>
  );
}