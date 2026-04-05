
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
    return gallery.caption && gallery.category
}

const validGalleryCategory = (category) => {
    return category.title;
}


const categoriesToClient = (categories) => {
    return categories.map(category => ({
        id: category.id,
        title: category.title
    }))
}

module.exports= {
    galleriesToClient,
    validGallery,
    validGalleryCategory,
    categoriesToClient
}