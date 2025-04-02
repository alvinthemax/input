// pages/api/data.js
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'interfaces', 'data.json');

export default async function handler(req, res) {
  // No cache headers
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  
  try {
    // Debug logging
    console.log('Request method:', req.method);
    console.log('Data path exists:', fs.existsSync(dataPath));

    if (req.method === 'GET') {
      const data = fs.readFileSync(dataPath, 'utf8');
      console.log('Current data:', data);
      return res.status(200).json(JSON.parse(data));
    }

    if (req.method === 'POST') {
      console.log('New data:', req.body);
      fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
      
      // Verifikasi perubahan
      const updatedData = fs.readFileSync(dataPath, 'utf8');
      console.log('Updated data:', updatedData);
      
      return res.status(200).json({ 
        message: 'Data saved successfully',
        data: JSON.parse(updatedData)
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
