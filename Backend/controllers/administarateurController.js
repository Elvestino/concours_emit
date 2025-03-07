const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Administrateur = require("../models/administrateur");

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

    const admin = await Administrateur.findOne({ where: { username }});
    if (!admin) {
        return res.status(401).json({message: "Utilisateur non trover"});
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({message: "mot de passe incorrect"});
    }

    const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Connexion reussie", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }

}