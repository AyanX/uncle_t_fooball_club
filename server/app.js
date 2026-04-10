const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');
const helmet = require('helmet');
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
const cookieParser = require('cookie-parser');
app.use(cookieParser());  
app.use(
  cors({
    origin: ["https://uncletfootballclub.com","https://admin.uncletfootballclub.com"],
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
const programTitleRouter = require('./routers/programs/titles/titles.router');
const clicksRouter = require('./routers/clicks/clicks.router');
const useAuth = require('./utils/useAuth');
const AuthCheck = require('./controllers/authChecker/auth');
const TeamNameRouter = require('./controllers/teamName/teamName');
const messagesRouter = require('./routers/messages/messages.router');
const AdminController = require('./controllers/admin/admin.controller');
const NewsController = require('./controllers/news/news.controller');
const LogoController = require('./controllers/logo/logo.controller');
const { upload } = require('ayan-pkg');



app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to Soccer Uncle T Club"});
});

app.use("/api/players", playersRouter);

app.get("/api/news/categories", NewsController.getNewsCategories)

app.use("/api/news", newsRouter)



app.use("/api/fixtures", fixturesRouter);

app.use("/api/partners", partnersRouter)

app.use("/api/gallery",galleryRouter)

app.use("/api/club", clubRouter)

app.use("/api/socials", socialsRouter);

app.use("/api/programmes", programTitleRouter )

app.use("/api/admin",adminRouter)

app.use("/api/programs", programsRouter )

app.use("/api/views", clicksRouter)

app.use("/api/messages", messagesRouter)

app.use("/api/teamname", TeamNameRouter)

app.use("/api/login-with-pin", AdminController.loginWithPin)

app.use("/api/auth", useAuth, AuthCheck.checkAuth)
app.get("/api/logo", LogoController.getLogo)
app.put("/api/logo", upload, LogoController.createLogo)


app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

module.exports = app;