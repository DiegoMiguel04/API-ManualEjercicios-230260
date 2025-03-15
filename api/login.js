import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb+srv://xkis-db:1234@api-awi-40-230260.yp44i.mongodb.net/?retryWrites=true&w=majority&appName=API-AWI-40-230260');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "ID de sesión requerido" });
    }
    try {
      await client.connect();
      const database = client.db('your-database');
      const session = await database.collection('sessions').findOneAndUpdate(
        { _id: sessionId },
        { $set: { status: "active" } },
        { returnDocument: 'after' }
      );
      if (!session.value) {
        return res.status(404).json({ message: "Sesión no encontrada" });
      }
      res.json({ message: "Sesión iniciada exitosamente", session: session.value });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar la sesión", error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
};