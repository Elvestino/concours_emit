require("dotenv").config();
const bcrypt = require("bcryptjs");
const Administrateur = require("./models/administrateur");
const sequelize = require("./config/database");

const createAdmin = async () => {
    try {
        await sequelize.sync();

        const username = "Emifi_Admin";
        const password = "Em!f!_@concours#2025";

        const existingAdmin  = await Administrateur.findOne({where: {username}});
        if (existingAdmin) {
            console.log("Administrateur deja existe");
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Administrateur.create({username, password: hashedPassword});

        console.log("ADMINISTRATEUR CREER AVEC SUCCES")

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'administrateur")
    } finally {
        process.exit();
    }
};

createAdmin();