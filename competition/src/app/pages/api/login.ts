// pages/api/login.ts
import jwt from "jsonwebtoken";

const users = [
  { email: "admin@exemple.com", password: "admin123", role: "admin" },
  // Ajoutez d'autres utilisateurs si nécessaire
];

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Vérifier les informations d'identification
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Vérifiez que JWT_SECRET est bien définie
      const secretKey = process.env.JWT_SECRET;

      if (!secretKey) {
        // Si la clé secrète est absente, retourner une erreur
        return res
          .status(500)
          .json({ message: "Clé secrète manquante dans le fichier .env" });
      }

      // Créez le token JWT avec la clé secrète provenant de .env
      const token = jwt.sign(
        { email: user.email, role: user.role },
        secretKey, // Utilisation de la clé secrète dans .env
        { expiresIn: "1h" } // Expiration du token après 1 heure
      );

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Informations incorrectes" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
