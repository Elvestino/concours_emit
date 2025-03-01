const express = require("express");
const cors = require("cors");
const path = require("path");
const participanRoutes = require("./routes/participantRoutes");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PATCH, PUT",
    allowedHeaders: "Content-Type",
  },
});

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PATCH, PUT",
    allowedHeaders: "Content-Type",
  })
);
app.use(express.json());

app.use(
  "/api",
  (req, res, next) => {
    req.io = io;
    next();
  },
  participanRoutes
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp3")) {
        res.setHeaders("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", "attachement");
      }
    },
  })
);

io.on("connection", (socket) => {
  console.log("un jury se connecter ", socket.id);

  socket.on("accepterCandidat", (candidatId) => {
    console.log(`candidat accepter : ${candidatId}`);
    io.emit("participantAccepted", { id: candidatId, accepted: true });
  });

  socket.on("disconnect", () => {
    console.log("un jury d'est deconnecter");
  });
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("connection reussie");
  } catch (error) {
    console.error("erreur", error);
  }
})();

server.listen(PORT, () => {
  console.log(`mandeha ny server ${PORT}`);
});
