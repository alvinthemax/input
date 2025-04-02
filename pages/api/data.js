// pages/api/data.js
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'interfaces', 'data.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Error reading data file' });
    }
  } else if (req.method === 'POST') {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
