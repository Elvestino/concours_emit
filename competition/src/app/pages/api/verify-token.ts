import jwt from "jsonwebtoken";

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    return res.status(500).json({ message: "Clé secrète manquante" });
  }

  try {
    const decoded: any = jwt.verify(token, secretKey);

    if (decoded.role === "admin") {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ message: "Accès interdit" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}
