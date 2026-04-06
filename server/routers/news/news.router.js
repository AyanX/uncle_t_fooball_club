const express = require('express');
const NewsController = require('../../controllers/news/news.controller');
const { upload } = require('ayan-pkg');
const newsRouter = express.Router();

newsRouter.get("/", NewsController.getNews);
newsRouter.post("/", upload, NewsController.addNews);
newsRouter.put("/:id", upload, NewsController.updateNews);
newsRouter.delete("/:id", NewsController.deleteNews);

newsRouter.get("/:slug", NewsController.getNewsBySlug);

newsRouter.post("/features/:id", upload, NewsController.addFeatured);

newsRouter.get("/categories", NewsController.getNewsCategories);
newsRouter.post("/categories", upload, NewsController.addNewsCategory);
newsRouter.put("/categories/:id", upload, NewsController.updateNewsCategory);
newsRouter.delete("/categories/:id", NewsController.deleteNewsCategory);


module.exports = newsRouter;