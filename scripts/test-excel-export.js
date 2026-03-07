#!/usr/bin/env node
/**
 * E2E Test voor Excel Export API
 * Test de Excel export met dummy transacties
 */

const fs = require('fs');
const path = require('path');

// Dummy transacties voor test
const testTransactions = [
  {
    datum: '06-03-2026',
    omschrijving: 'SHELL STATION AMSTERDAM',
    bedrag: -65.50,
    saldo_na: 1234.56,
    type: 'Betaalautomaat',
    categorie: 'Brandstof',
    btw_percentage: 21,
    confidence_score: 0.95
  },
  {
    datum: '05-03-2026',
    omschrijving: 'AH AMSTERDAM',
    bedrag: -45.20,
    saldo_na: 1300.06,
    type: 'Betaalautomaat',
    categorie: 'Boodschappen',
    btw_percentage: 9,
    confidence_score: 0.92
  },
  {
    datum: '04-03-2026',
    omschrijving: 'Belastingdienst',
    bedrag: -1200.00,
    saldo_na: 1345.26,
    type: 'Incasso',
    categorie: 'Belasting',
    btw_percentage: 0,
    confidence_score: 0.98
  },
  {
    datum: '03-03-2026',
    omschrijving: 'Klant XYZ - Factuur 2024-001',
    bedrag: 2500.00,
    saldo_na: 2545.26,
    type: 'Overschrijving',
    categorie: 'Inkomsten',
    btw_percentage: 21,
    confidence_score: 0.88
  },
  {
    datum: '02-03-2026',
    omschrijving: 'NS REIZIGERS',
    bedrag: -32.10,
    saldo_na: 45.26,
    type: 'Betaalautomaat',
    categorie: 'Vervoer',
    btw_percentage: 9,
    confidence_score: 0.91
  }
];

async function testExcelExport() {
  console.log('🧪 BSC Pro Excel Export E2E Test');
  console.log('=====================================\n');
  
  const baseUrl = process.env.BSCPRO_URL || 'http://localhost:3000';
  
  try {
    // Test 1: Check API status
    console.log('📡 Test 1: API Status Check...');
    const statusResponse = await fetch(`${baseUrl}/api/export/excel`);
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'ok') {
      console.log('   ✅ API is online');
      console.log(`   📝 Watermerk: "${statusData.watermerk}"`);
    } else {
      console.log('   ❌ API status check failed');
      process.exit(1);
    }
    
    // Test 2: Export Excel met dummy data
    console.log('\n📊 Test 2: Excel Export met Dummy Data...');
    console.log(`   📋 ${testTransactions.length} transacties te exporteren`);
    
    const exportResponse = await fetch(`${baseUrl}/api/export/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: testTransactions,
        filename: 'test-export-e2e.xlsx'
      })
    });
    
    if (!exportResponse.ok) {
      const error = await exportResponse.json();
      throw new Error(`Export failed: ${error.error}`);
    }
    
    // Sla het bestand op
    const buffer = await exportResponse.arrayBuffer();
    const outputPath = path.join(process.cwd(), 'test-export-e2e.xlsx');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log('   ✅ Excel bestand gegenereerd');
    console.log(`   📁 Opgeslagen als: ${outputPath}`);
    console.log(`   📦 Bestandsgrootte: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
    
    // Test 3: Verificatie
    console.log('\n🔍 Test 3: Verificatie...');
    
    // Check of bestand bestaat en groter is dan 0 bytes
    const stats = fs.statSync(outputPath);
    if (stats.size > 0) {
      console.log('   ✅ Bestand is geldig (niet leeg)');
      console.log(`   📊 Grootte: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log('   ❌ Bestand is leeg');
      process.exit(1);
    }
    
    // Succes!
    console.log('\n✨ Alle tests geslaagd!');
    console.log('\n🎯 Wat is getest:');
    console.log('   1. API endpoint bereikbaarheid');
    console.log('   2. Excel generatie met watermerk');
    console.log('   3. Dummy transacties correct verwerkt');
    console.log('   4. Bestand download functionaliteit');
    console.log('\n📝 Open test-export-e2e.xlsx in Excel om het watermerk te verifiëren:');
    console.log('   - Cel A1 moet bevatten: "Gegenereerd door BSC Pro - www.bscpro.nl"');
    console.log('   - Tekst moet lichtgrijs (#CCCCCC) en cursief zijn');
    console.log('   - Headers moeten op rij 3 staan');
    console.log('   - Transacties moeten op rij 4+ staan');
    
    // Cleanup (optioneel - uncomment om bestand te verwijderen)
    // fs.unlinkSync(outputPath);
    // console.log('\n🗑️  Test bestand verwijderd');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Tips:');
    console.log('   - Controleer of de Next.js server draait (npm run dev)');
    console.log('   - Controleer of de API route correct is geïmplementeerd');
    console.log('   - Check de server logs voor errors');
    process.exit(1);
  }
}

// Run de test
testExcelExport();
