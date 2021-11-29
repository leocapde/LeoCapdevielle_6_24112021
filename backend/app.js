// Ressources importées

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connexion à MongoDB

mongoose.connect('mongodb+srv://leo_capde:Claepod64@cluster0.w3you.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée ...'))
;

// Utilisation du framework Express

const app = express();

// Middleware

    // Ajout des headers pour éviter les erreurs CORS

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });

    // Analyse de la requête

    app.use(express.json());

    // Création des routes

    app.use('/images', express.static(path.join(__dirname, 'images')));
    
    app.use("/api/auth", userRoutes);
    app.use("/api/sauces", sauceRoutes);

// Exporter la ressource

module.exports = app;