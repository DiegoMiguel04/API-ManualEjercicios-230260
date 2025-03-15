import { MongoClient } from "mongodb";
import Cors from "cors";

const cors = Cors({
  methods: ['GET', 'POST'],
});

const client = new MongoClient('mongodb+srv://xkis-db:1234@api-awi-40-230260.yp44i.mongodb.net/?retryWrites=true&w=majority&appName=API-AWI-40-230260');

const runCors = (req, res) => new Promise((resolve, reject) => {
  cors(req, res, (result) => {
    if (result instanceof Error) {
      reject(result);
    }
    resolve(result);
  });
});

export default async (req, res) => {
  await runCors(req, res);

  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    try {
      await client.connect();
      const database = client.db('your-database');
      const newSession = await database.collection('sessions').insertOne({ name, email, password, status: 'active', createdAt: new Date() });
      res.status(201).json({ message: "Sesión creada", session: newSession });
    } catch (error) {
      res.status(500).json({ message: "Error al crear la sesión", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
};
