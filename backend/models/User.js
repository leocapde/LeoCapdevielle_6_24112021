// Ressources importées

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création des models

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
});

// Vérification que l'email de l'utilisateur est unique

userSchema.plugin(uniqueValidator);

// Exporter la ressource

module.exports = mongoose.model("User", userSchema);