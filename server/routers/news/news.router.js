const express = require('express');
const NewsController = require('../../controllers/news/news.controller');
const { upload } = require('ayan-pkg');
const useAuth = require('../../utils/useAuth');
const newsRouter = express.Router();

newsRouter.get("/", NewsController.getNews);
newsRouter.post("/", useAuth,upload, NewsController.addNews);
newsRouter.put("/:id", useAuth, upload, NewsController.updateNews);
newsRouter.delete("/:id", useAuth, NewsController.deleteNews);

newsRouter.get("/:slug", NewsController.getNewsBySlug);

newsRouter.post("/features/:id", useAuth, upload, NewsController.addFeatured);

newsRouter.get("/categories", NewsController.getNewsCategories);
newsRouter.post("/categories", useAuth, upload, NewsController.addNewsCategory);
newsRouter.put("/categories/:id", useAuth, upload, NewsController.updateNewsCategory);
newsRouter.delete("/categories/:id", useAuth, NewsController.deleteNewsCategory);


module.exports = newsRouter;