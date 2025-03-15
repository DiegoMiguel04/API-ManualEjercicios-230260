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
    const { nombre, recaudacion } = req.body;
    if (!nombre || recaudacion === undefined) {
      return res.status(400).json({ message: "Nombre y recaudación son requeridos" });
    }
    try {
      await client.connect();
      const database = client.db('your-database');
      const newMovie = await database.collection('movies').insertOne({ nombre, recaudacion });
      res.status(201).json({ message: "Película agregada", movie: newMovie });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar la película", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
};
