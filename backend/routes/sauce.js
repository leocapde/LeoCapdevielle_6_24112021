// Ressources importées

const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

// Middleware

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Routes

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.sendOpinion);

// Exporter la ressource

module.exports = router;