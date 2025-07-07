import { MongoClient } from 'mongodb';

let client = null;
let db = null;

const uri = process.env.MONGODB_URI || 'mongodb+srv://purav:Purav308@cluster0.al3fi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'splitwise';

export async function getDatabase() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db(dbName);

  // Ensure indexes are created only once
  try {
    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('expenses').createIndex({ user_id: 1 }),
    ]);
  } catch (error) {
    // Index might already exist, ignore error
    console.log('Index creation error (might already exist):', error.message);
  }

  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
