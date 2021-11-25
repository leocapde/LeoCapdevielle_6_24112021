// Ressources importées

const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
    console.log("Requête reçue !");
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({message: "Votre requête à bien été reçue Bro !"});
    next();
});

app.use((req, res, next) => {
    console.log("Réponse envoyée avec succès !");
});

// Exporter la ressource

module.exports = app;