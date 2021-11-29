// Ressources importées

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création des models

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Vérification que l'email de l'utilisateur est unique

userSchema.plugin(uniqueValidator);

// Exporter la ressource

module.exports = mongoose.model("User", userSchema);