
const galleriesToClient = (galleries) => {
    return galleries.map(gallery => ({
        id: gallery.id,
        image: gallery.image,
        caption: gallery.caption,
        blur_image: gallery.blur_image,
        category: gallery.category,
        featured: gallery.featured
    }))
}

const validGallery =(gallery)=>{
    console.log(gallery)
    return gallery.caption && gallery.category
}

const validGalleryCategory = (category) => {
    return category.title;
}


const categoriesToClient = (categories) => {
    return categories.map(category => ({
        id: category.id,
        title: category.title.toUpperCase()
    }))
}
const normalizeBoolean = (value) => {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  return false;
};


module.exports= {
    galleriesToClient,
    validGallery,
    normalizeBoolean,
    validGalleryCategory,
    categoriesToClient
}