// Ressources importées

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body, validationResult} = require('express-validator');

const userCtrl = require("../controllers/user");

// Limitation du nombre de tentative de connexion

const attemptLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
});

// Validation des entrées

const expressValidator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    } else {
        next();
    }
};

const checkReq = [
    body("email").isEmail(),
    body("password").isLength({min: 4})
];

// Routes

router.post("/signup", checkReq, expressValidator, userCtrl.signup);
router.post("/login", attemptLimiter, checkReq, expressValidator, userCtrl.login);

// Exporter la ressource

module.exports = router;