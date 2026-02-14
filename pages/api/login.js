import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;


function calculateSimilarity(hash1, hash2) {

  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 0;

  let matchingBits = 0;


  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] === hash2[i]) {
      matchingBits++;
    }
  }


  const similarity = (matchingBits / hash1.length) * 100;
  return Math.round(similarity * 10) / 10;
}

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

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Register first.' });
    }


    const similarity = calculateSimilarity(fingerprint, user.fingerprint);

    console.log('Similarity:', similarity + '%');

    const THRESHOLD = 70;

    if (similarity >= THRESHOLD) {
      res.status(200).json({
        success: true,
        message: `Login successful! Object matched ${similarity}%`,
        similarity: similarity
      });
    } else {
      res.status(401).json({
        success: false,
        message: `Authentication failed. Object matched only ${similarity}%. Need ${THRESHOLD}%+`,
        similarity: similarity
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  } finally {
    await client.close();
  }
}