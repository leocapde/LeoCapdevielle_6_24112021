// Ressources importées

const Sauce = require("../models/Sauce");
const fs = require("fs");

// Logique métier

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const newSauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    newSauce.save()
    .then(() => res.status(201).json({message: "Nouvelle sauce créée !"}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId === req.token.userId) {
            const sauceObject = req.file ? 
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            } : {...req.body};
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce modifiée !"}))
            .catch(error => res.status(500).json({error}));
        } else {
            return res.status(403).json({error: "Unauthorized request"})
        }
    })
    .catch(error => res.status(500).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId === req.token.userId) {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: "Sauce supprimée..."}))
                .catch(error => res.status(400).json({error}));
            })
        } else {
            return res.status(403).json({error: "Unauthorized request"})
        }
    })
    .catch(error => res.status(500).json({error}));
};

exports.sendOpinion = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const indexOfUsersLiked = sauce.usersLiked.indexOf(req.body.userId);
        const indexOfUsersDisliked = sauce.usersDisliked.indexOf(req.body.userId);
        if (indexOfUsersLiked > -1) {
            sauce.usersLiked.splice(indexOfUsersLiked, 1);
            sauce.likes = sauce.usersLiked.length;
            Sauce.updateOne({_id: req.params.id}, {
                usersLiked: sauce.usersLiked,
                likes: sauce.likes,
                _id: req.params.id
            })
            .then(() => res.status(200).json({message: "Like retiré !"}))
            .catch(error => res.status(500).json({error}));
        } else if (indexOfUsersDisliked > -1) {
            sauce.usersDisliked.splice(indexOfUsersDisliked, 1);
            sauce.dislikes = sauce.usersDisliked.length;
            Sauce.updateOne({_id: req.params.id}, {
                usersDisliked: sauce.usersDisliked,
                dislikes: sauce.dislikes,
                _id: req.params.id
            })
            .then(() => res.status(200).json({message: "Dislike retiré"}))
            .catch(error => res.status(500).json({error}));
        } else {
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes = sauce.usersLiked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    usersLiked: sauce.usersLiked,
                    likes: sauce.likes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Like ajouté !"}))
                .catch(error => res.status(500).json({error}));
            } else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes = sauce.usersDisliked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    usersDisliked: sauce.usersDisliked,
                    dislikes: sauce.dislikes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Dislike ajouté !"}))
                .catch(error => res.status(500).json({error}));
            }
        }
    })
    .catch(error => res.status(500).json({error}));
};