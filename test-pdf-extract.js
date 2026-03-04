const fs = require('fs');

// Probeer pdf-parse
try {
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync('test-bank.pdf');
  
  pdfParse(dataBuffer).then(data => {
    console.log('PDF tekst gevonden:', data.text.length, 'karakters');
    console.log('Eerste 200 karakters:', data.text.substring(0, 200));
    console.log('Is het leeg?', data.text.trim().length === 0);
    
    // Als het leeg is, gebruik dan dummy data voor testing
    if (data.text.trim().length === 0) {
      console.log('\nPDF is leeg of bevat geen tekst. Gebruik dummy data voor testing:');
      const dummyText = `Rabobank rekening: NL12RABO0123456789
Rekeninghouder: J. de Vries
Periode: 01-01-2024 tot 31-01-2024
Saldo begin: €1.250,00

Transacties:
01-01-2024 Albert Heijn Amsterdam -€85,43
05-01-2024 NS treinkaartje -€12,50
15-01-2024 Salaris ING +€2.500,00
20-01-2024 Bol.com -€129,99
25-01-2024 Tankstation Shell -€65,20
31-01-2024 Netflix -€12,99

Saldo eind: €3.442,89`;
      console.log('Dummy tekst:', dummyText);
    }
  }).catch(err => {
    console.log('pdf-parse error:', err.message);
  });
} catch (err) {
  console.log('Kan pdf-parse niet laden:', err.message);
}
