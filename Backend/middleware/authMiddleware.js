const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Acces refuse: token manquant" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Acces refuse: token mal formaté" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next(); 
    } catch (error) {
        console.error("Erreur de vérification du token :", error);
        res.status(401).json({ message: "invalide Token" });
    }
};