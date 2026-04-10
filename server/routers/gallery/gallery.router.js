const express= require('express');
const GalleryController = require('../../controllers/gallery/gallery.controller');
const { upload } = require('ayan-pkg');
const useAuth = require('../../utils/useAuth');

const galleryRouter = express.Router();

galleryRouter.post("/", useAuth, upload, GalleryController.createGallery);   
galleryRouter.get("/", GalleryController.getAllGalleries);
galleryRouter.put("/:id", useAuth, upload,GalleryController.updateGallery);
galleryRouter.delete("/:id", useAuth, GalleryController.deleteGallery);

// gallery categories titles  /titles

galleryRouter.post("/titles", useAuth, GalleryController.createGalleryCategory);
galleryRouter.get("/titles", GalleryController.getAllGalleryCategories);
galleryRouter.put("/titles/:id", useAuth, GalleryController.updateGalleryCategory);
galleryRouter.delete("/titles/:id", useAuth, GalleryController.deleteGalleryCategory);


module.exports = galleryRouter;