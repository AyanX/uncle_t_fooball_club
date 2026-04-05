const express= require('express');
const GalleryController = require('../../controllers/gallery/gallery.controller');
const { upload } = require('ayan-pkg');

const galleryRouter = express.Router();

galleryRouter.post("/", upload, GalleryController.createGallery);   
galleryRouter.get("/", GalleryController.getAllGalleries);
galleryRouter.put("/:id", GalleryController.updateGallery);
galleryRouter.delete("/:id", GalleryController.deleteGallery);

// gallery categories titles  /titles

galleryRouter.post("/titles", GalleryController.createGalleryCategory);
galleryRouter.get("/titles", GalleryController.getAllGalleryCategories);
galleryRouter.put("/titles/:id", GalleryController.updateGalleryCategory);
galleryRouter.delete("/titles/:id", GalleryController.deleteGalleryCategory);


module.exports = galleryRouter;