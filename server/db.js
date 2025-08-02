import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
const uri = "mongodb+srv://karaokeorder:KaraokeOrderAtlasDB123@karaokeorder.mhacufr.mongodb.net/?retryWrites=true&w=majority&appName=KaraokeOrder";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB (Atlas)");
  } catch (err) {
    console.error("Erro ao conectar Mongo:", err.message);
  }
}

run().catch(console.dir);

export let db = client.db('todoapp');
const sessionsCollection = db.collection('sessions');

export async function getAllSessions() {
  try {
    const sessions = await sessionsCollection.find({}).toArray();
    return sessions;
  } catch (err) {
    console.error('Erro ao pegar todos as sessões:', err);
    return [];
  }
}

export async function addSession(data) {
  try {
    const result = await sessionsCollection.insertOne(data);
    return { success: true, insertedId: result.insertedId };
  } catch (err) {
    console.error('Erro ao adicionar sessão:', err);
    return { success: false, error: err.message };
  }
}

export async function findSessionByName(name) {
  try {
    const session = await sessionsCollection.findOne({name: name});
    return session;
  } catch (err) {
    console.error(`Erro ao procurar a sessão '${name}':`, err);
    return null;
  }
}

export async function updateSession(name, data) {
  try {
    const result = await sessionsCollection.updateOne(
      {name: name},
      {$set: data}
    );
    if (result.modifiedCount > 0){
      return {success: true, modifiedCount: result.modifiedCount};
    } else {throw new Error(`Sessão não foi modificada`)
    }
  } catch (err) {
    console.error(`Erro ao dar update na sessão '${name}':`, err);
    return { success: false, error: err.message };
  }
}