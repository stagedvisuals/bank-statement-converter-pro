import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Test convert debug endpoint called');
    
    // Simpele response om te testen
    return res.status(200).json({
      success: true,
      message: 'Test endpoint werkt',
      test: 'Bank statement converter test',
      timestamp: new Date().toISOString(),
      env: {
        groqKey: process.env.GROQ_API_KEY ? 'SET' : 'NOT SET',
        nodeEnv: process.env.NODE_ENV
      }
    });
    
  } catch (error: any) {
    console.error('Test convert error:', error);
    return res.status(500).json({
      error: 'Test error: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
