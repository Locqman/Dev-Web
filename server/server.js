const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const objetRoutes   = require('./routes/objets');
const serviceRoutes = require('./routes/services');
const actuRoutes    = require('./routes/actualites');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/objets',     objetRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/actualites', actuRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'SkiConnect API is running 🎿' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
