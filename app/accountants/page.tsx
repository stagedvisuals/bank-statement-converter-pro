export default function AccountantsPage() {
  return (
    <div style={{ backgroundColor: '#080d14', color: '#e8edf5', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Voor Accountants</h1>
        <p style={{ color: '#6b7fa3', marginBottom: '2rem' }}>Speciale tools en features voor accountantskantoren</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: '#0a1220', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bulk Processing</h2>
            <p style={{ color: '#6b7fa3' }}>Verwerk meerdere bankafschriften tegelijk voor al je klanten.</p>
          </div>
          
          <div style={{ backgroundColor: '#0a1220', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>White-label</h2>
            <p style={{ color: '#6b7fa3' }}>Oplossing onder je eigen merk voor je klanten.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
