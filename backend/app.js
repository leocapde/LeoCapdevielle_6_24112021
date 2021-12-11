// Ressources importées

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require("helmet");
const xssClean = require("xss-clean");

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

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    });
    app.use(express.json());
    app.use(helmet());
    app.use(xssClean());

    // Création des routes

    app.use('/images', express.static(path.join(__dirname, 'images')));
    
    app.use("/api/auth", userRoutes);
    app.use("/api/sauces", sauceRoutes);

// Exporter la ressource

module.exports = app;