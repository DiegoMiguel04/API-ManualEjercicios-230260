const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://xkis-db:1234@api-awi-40-230260.yp44i.mongodb.net/?retryWrites=true&w=majority&appName=API-AWI-40-230260')
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log("Error al conectar a MongoDB:", err));

const sessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model("Session", sessionSchema);

const movieSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  recaudacion: { type: Number, required: true }
});

const Movie = mongoose.model("Movie", movieSchema);

app.get("/allSessions", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las sesiones", error });
  }
});

app.post("/createSession", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newSession = new Session({ name, email, password });
    await newSession.save();
    res.status(201).json({ message: "Sesión creada", session: newSession });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la sesión", error });
  }
});

app.post("/login", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ message: "ID de sesión requerido" });
  }
  try {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: "active" },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }
    res.json({ message: "Sesión iniciada exitosamente", session });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar la sesión", error });
  }
});

app.post("/logout", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ message: "ID de sesión requerido" });
  }
  try {
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: "inactive" },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Sesión no encontrada" });
    }
    res.json({ message: "Sesión cerrada exitosamente", session });
  } catch (error) {
    res.status(500).json({ message: "Error al cerrar la sesión", error });
  }
});

app.get("/allMovies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las películas", error });
  }
});

app.post("/addMovie", async (req, res) => {
  const { nombre, recaudacion } = req.body;
  if (!nombre || recaudacion === undefined) {
    return res.status(400).json({ message: "Nombre y recaudación son requeridos" });
  }

  try {
    const newMovie = new Movie({ nombre, recaudacion });
    await newMovie.save();
    res.status(201).json({ message: "Película agregada", movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la película", error });
  }
});


app.listen(5000, () => {
  console.log(`Servidor corriendo en el puerto 5000`);
});