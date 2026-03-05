require('dotenv').config({ path: '.env.local' });

const groqApiKey = process.env.GROQ_API_KEY;
console.log('GROQ_API_KEY from .env.local:', groqApiKey ? 'SET (' + groqApiKey.substring(0, 10) + '...)' : 'NOT SET');

// Test Groq API
fetch('https://api.groq.com/openai/v1/models', {
  headers: { 
    'Authorization': 'Bearer ' + groqApiKey,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Response status:', r.status, r.statusText);
  return r.json();
})
.then(d => {
  console.log('Groq API response:');
  console.log('First model:', d.data?.[0]?.id);
  console.log('Total models:', d.data?.length);
})
.catch(e => {
  console.log('Groq API error:', e.message);
  console.log('Error stack:', e.stack);
});
