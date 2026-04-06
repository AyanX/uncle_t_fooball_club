const { eq, desc } = require("drizzle-orm");
const {db, galleryCategoryTable,galleryTable} = require("../tables");
const {generateBlurImage} = require("ayan-pkg")

const { galleriesToClient, validGallery, categoriesToClient, validGalleryCategory } = require("./gallery.utils");

class GalleryController {
    static async getAllGalleries(req, res) {
        try{
            const galleries = await db.select().from(galleryTable).where(eq(galleryTable.isDeleted, false)).orderBy(desc(galleryTable.created_at));
           
           if(!galleries || galleries.length === 0){
            return res.status(200).json({ message: 'No galleries found', data: [] });
           }
           
            return res.status(200).json({ message: 'Galleries fetched successfully', data: galleriesToClient(galleries) });
        }
        catch(err){
            console.error('Error fetching galleries:', err);
           return res.status(500).json({ error: 'Failed to fetch galleries', data:[] });
        }
    }

    static async updateGallery(req, res) {
        try {
            if(!validGallery(req.body)){
                return res.status(400).json({ error: 'Invalid gallery data', data: null });
            }

            const {id} = req.params;

            if(!id){
                return res.status(400).json({ error: 'Gallery ID is required', data: null });
            }




            const galleryId = parseInt(id);

            //check if it exists
            const gallery = await db.select().from(galleryTable).where(eq(galleryTable.id, galleryId)).limit(1);
            if(!gallery || gallery.length === 0){
                return res.status(404).json({ error: 'Gallery not found', data: null });
            }

            const image = req.fileUrl || req.body.image

               if(!image){
                return res.status(400).json({ error: 'Image is required', data: null });
            }

            const { caption, category, featured } = req.body;

            //update
          
            await db.update(galleryTable).set({
                image: image,
                caption,
                category,
                featured : featured === true ? 1 : 0,
                blur_image: image
            }).where(eq(galleryTable.id, galleryId));

            // send the data with the response, and then update blur in background
            res.status(200).json({ message: 'Gallery updated successfully', data:{image, caption, category, featured: featured === true ? 1 : 0 , blur_image: image, id: galleryId} });

            if(!req.fileUrl)return

            //generate blur
            const blur = await generateBlurImage(image);
            if(blur){
                await db.update(galleryTable).set({ blur_image: blur }).where(eq(galleryTable.id, galleryId));
            }

            return;


        } catch (error) {
            console.error('Error updating gallery:', error);
            return res.status(500).json({ error: 'Failed to update gallery', data: null });
        }
    }

    static async deleteGallery(req, res) {
        try {
            if(!req.params.id){
                return res.status(400).json({ error: 'Gallery ID is required', data: null });
            }

            const galleryId = parseInt(req.params.id);

            //check if it exists
            const gallery = await db.select().from(galleryTable).where(eq(galleryTable.id, galleryId)).limit(1);
            if(!gallery || gallery.length === 0){
                return res.status(404).json({ error: 'Gallery not found', data: null });
            }

            //soft delete
            await db.update(galleryTable).set({ isDeleted: true }).where(eq(galleryTable.id, galleryId));

            return res.status(200).json({ message: 'Gallery deleted successfully', data: null });



        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete gallery' , data: null});
        }
    }

    static async createGallery(req, res) {
        try {    if(!validGallery(req.body)){
                return res.status(400).json({ error: 'Invalid gallery data', data: null });
            }
            const image = req.fileUrl 

            if(!image){
                return res.status(400).json({ error: 'Image is required', data: null });
            }
            const { caption, category, featured } = req.body;

            

          await db.insert(galleryTable).values({
                image,
                caption,
                category,
                blur_image: image,
                featured: featured === true ? 1 : 0
            })

            // fetch it for response, last entry

            const newGallery = await db.select().from(galleryTable).where(eq(galleryTable.isDeleted, false)).orderBy(desc(galleryTable.created_at)).limit(1);
            // give res and generate blur
            res.status(201).json({ message: 'Gallery created successfully', data:{image, caption, category, featured:  featured === "true" ? 1 : 0 , blur_image: image, id: newGallery[0].id} });
            
            //update blur in background
            const blur = await generateBlurImage(image);
            if(blur){
                await db.update(galleryTable).set({ blur_image: blur }).where(eq(galleryTable.id, newGallery[0].id));
            }

            return;

        } catch (error) {
            console.error("error adding gallery",error)
            return res.status(500).json({ error: 'Failed to create gallery' , data: null});
        }
    }


    // gallery categories
    static async getAllGalleryCategories(req, res) {
        try {
            const categories = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.isDeleted, false)).orderBy(desc(galleryCategoryTable.created_at));
            if(!categories || categories.length === 0){
                return res.status(200).json({ message: 'No gallery categories found', data: [] });
            }
            return res.status(200).json({ message: 'Gallery categories fetched successfully', data: categoriesToClient(categories) });

        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch gallery categories', data: [] });
        }
    }
    
    static async updateGalleryCategory(req, res) {
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(400).json({ error: 'Gallery category ID is required', data: null });
            }
            console.log('Updating gallery category with ID:', id, 'and data:', req.body);
            if(!validGalleryCategory(req.body)){
                console.error('Invalid gallery category data:', req.body);
                return res.status(400).json({ error: 'Invalid gallery category data', data: null });
            }

            const categoryId = parseInt(id);

            //check if it exists
            const category = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.id, categoryId)).limit(1);
            if(!category || category.length === 0){
                return res.status(404).json({ error: 'Gallery category not found', data: null });
            }

                   //check if an entry exists with same title, if yes, return error
            const existingCategory = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.title, req.body.title   )).limit(1);
            if(existingCategory && existingCategory.length > 0){
                return res.status(400).json({ error: 'Gallery category with this title already exists', data: null });
            }


            //update
            await db.update(galleryCategoryTable).set({
                title: req.body.title
            }).where(eq(galleryCategoryTable.id, categoryId));

            // send the data with the response
            res.status(200).json({ message: 'Gallery category updated successfully', data:{id: categoryId, title: req.body.title} });

            //scroll through galleries in db, update the category field for those with the same category as old title to new title, and update blur in background
            await db.update(galleryTable).set({
                category: req.body.title
            }).where(eq(galleryTable.category, category[0].title));


            return;
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update gallery category', data: null });
        }
    }
    static async deleteGalleryCategory(req, res) {
        try {
            if(!req.params.id){
                return res.status(400).json({ error: 'Gallery category ID is required', data: null });
            }

            const categoryId = parseInt(req.params.id);

            //check if it exists
            const category = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.id, categoryId)).limit(1);
            if(!category || category.length === 0){
                return res.status(404).json({ error: 'Gallery category not found', data: null });
            }

            //soft delete
            await db.update(galleryCategoryTable).set({ isDeleted: true }).where(eq(galleryCategoryTable.id, categoryId));

            return res.status(200).json({ message: 'Gallery category deleted successfully', data: null });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete gallery category' , data: null});
        }
    }
    static async createGalleryCategory(req, res) {
        try {
            if(!validGalleryCategory(req.body)){
                return res.status(400).json({ error: 'Invalid gallery category data', data: null });
            }

            const { title } = req.body;

            //check if an entry exists with same title, if yes, return error
            const existingCategory = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.title, title)).limit(1);
            if(existingCategory && existingCategory.length > 0){
                return res.status(400).json({ error: 'Gallery category with this title already exists', data: null });
            }

             await db.insert(galleryCategoryTable).values({
                title
            })

            // fetch it for response, last entry

            const newCategory = await db.select().from(galleryCategoryTable).where(eq(galleryCategoryTable.isDeleted, false)).orderBy(desc(galleryCategoryTable.created_at)).limit(1);
             // give res 
        return    res.status(201).json({ message: 'Gallery category created successfully', data:{id: newCategory[0].id, title} });


        } catch (error) {
            console.error('Error creating gallery category:', error);
            return res.status(500).json({ error: 'Failed to create gallery category' , data: null});
        }
    }
}


module.exports = GalleryController;