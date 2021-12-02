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
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: "Sauce modifiée !"}))
    .catch(error => res.status(500).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimée..."}))
            .catch(error => res.status(400).json({error}));
        })
    })
    .catch(error => res.status(500).json({error}));
};

exports.sendOpinion = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const indexOfUserLiked = sauce.userLiked.indexOf(req.body.userId);
        const indexOfUserDisliked = sauce.userDisliked.indexOf(req.body.userId);
        if (indexOfUserLiked > -1) {
            if (req.body.like == 1) {
                res.status(200).json({message: "Like déjà ajouté !"});
            } else if (req.body.like == -1) {
                sauce.userLiked.splice(indexOfUserLiked, 1);
                sauce.likes = sauce.userLiked.length;
                sauce.userDisliked.push(req.body.userId);
                sauce.dislikes = sauce.userDisliked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userLiked: sauce.userLiked,
                    likes: sauce.likes,
                    userDisliked: sauce.userDisliked,
                    dislikes: sauce.dislikes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Like retiré et dislike ajouté !"}))
                .catch(error => res.status(500).json({error}));
            } else {
                // (req.body.like == 0)
                sauce.userLiked.splice(indexOfUserLiked, 1);
                sauce.likes = sauce.userLiked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userLiked: sauce.userLiked,
                    likes: sauce.likes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Like retiré !"}))
                .catch(error => res.status(500).json({error}));
            } 
        } else if (indexOfUserDisliked > -1) {
            if (req.body.like == -1){
                res.status(200).json({message: "Dislike déjà ajouté !"});
            } else if (req.body.like == 1) {
                sauce.userDisliked.splice(indexOfUserDisliked, 1);
                sauce.dislikes = sauce.userDisliked.length;
                sauce.userLiked.push(req.body.userId);
                sauce.likes = sauce.userLiked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userDisliked: sauce.userDisliked,
                    dislikes: sauce.dislikes,
                    userLiked: sauce.userLiked,
                    likes: sauce.likes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Dislike retiré et like ajouté !"}))
                .catch(error => res.status(500).json({error}));
            } else {
                // (req.body.like == 0)
                sauce.userDisliked.splice(indexOfUserDisliked, 1);
                sauce.dislikes = sauce.userDisliked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userDisliked: sauce.userDisliked,
                    dislikes: sauce.dislikes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Dislike retiré"}))
                .catch(error => res.status(500).json({error}));
            }
        } else {
            if (req.body.like == 1) {
                sauce.userLiked.push(req.body.userId);
                sauce.likes = sauce.userLiked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userLiked: sauce.userLiked,
                    likes: sauce.likes,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({message: "Like ajouté !"}))
                .catch(error => res.status(500).json({error}));
            }
            if (req.body.like == -1) {
                sauce.userDisliked.push(req.body.userId);
                sauce.dislikes = sauce.userDisliked.length;
                Sauce.updateOne({_id: req.params.id}, {
                    userDisliked: sauce.userDisliked,
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