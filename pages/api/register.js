import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }


  const { email, fingerprint } = req.body;

  if (!email || !fingerprint) {
    return res.status(400).json({ message: 'Email and fingerprint required' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('scanpass');
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already registered. Use different email.' });
    }


    await users.insertOne({
      email,
      fingerprint,
      createdAt: new Date()
    });

    res.status(200).json({ message: 'Registration successful!' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  } finally {
    await client.close();
  }
}