import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb+srv://xkis-db:1234@api-awi-40-230260.yp44i.mongodb.net/?retryWrites=true&w=majority&appName=API-AWI-40-230260');

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('your-database');
      const movies = await database.collection('movies').find().toArray();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las películas", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
};