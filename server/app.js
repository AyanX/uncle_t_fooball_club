const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname,"public" ,"uploads")));


const playersRouter = require("./routers/players/players.router");
const newsRouter = require('./routers/news/news.router');
const fixturesRouter = require('./routers/fixtures/fixtures.router');
const partnersRouter = require('./routers/partners/partners.router');
const galleryRouter = require('./routers/gallery/gallery.router');
const clubRouter = require('./routers/club/club.router');
const socialsRouter = require('./routers/socials/socials.router');
const programsRouter = require('./routers/programs/programs.router');
const adminRouter = require('./routers/admin/admin.router');



app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to Soccer Uncle T Club"});
});

app.use("/api/players", playersRouter);

app.use("/api/news", newsRouter)

app.use("/api/fixtures", fixturesRouter);

app.use("/api/partners", partnersRouter)

app.use("/api/gallery",galleryRouter)

app.use("/api/club", clubRouter)

app.use("/api/socials", socialsRouter);

app.use("/api/programmes", programsRouter )

app.use("/api/admin",adminRouter)

// app.use("/api/programs", programsRouter )

module.exports = app;