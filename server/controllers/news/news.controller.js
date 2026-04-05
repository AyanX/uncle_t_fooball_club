const { eq, desc } = require("drizzle-orm");
const { db, newsCategory ,newsTable} = require("../tables");
const {
  validNewsCategoryToClient,
  validNewsCategory,
  validNewsToClient,
  validNews,
} = require("./news.utils");

const {generateBlurImage}= require("ayan-pkg")

//TODO
class NewsController {
  static async getNewsCategories(req, res) {
    try {
      const categories = await db
        .select()
        .from(newsCategory)
        .where(eq(newsCategory.isDeleted, false))
        .orderBy(desc(newsCategory.created_at));
      if (categories.length === 0) {
        return res
          .status(404)
          .json({ data: [], message: "No news categories found" });
      }

      return res.status(200).json({
        data: validNewsCategoryToClient(categories),
        message: "News categories fetched successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ data: [], message: "Error fetching news categories" });
    }
  }

  static async addNewsCategory(req, res) {
    try {
      if (!validNewsCategory(req.body)) {
        return res
          .status(400)
          .json({ data: [], message: "Invalid news category data" });
      }
      const imageUrl = req.fileUrl || "";
      const { category } = req.body;
      await db.insert(newsCategory).values({ category, image: imageUrl });

      //fetch the new category to return to client
      const newCategory = await db
        .select()
        .from(newsCategory)
        .where(eq(newsCategory.category, category))
        .orderBy(desc(newsCategory.created_at))
        .limit(1);
      //if len ==0 , break and return error
      if (newCategory.length === 0) {
        return res
          .status(404)
          .json({
            data: [],
            message: "News category not found after insertion",
          });
      }

      return res
        .status(201)
        .json({
          data: validNewsCategoryToClient(newCategory),
          message: "News category added successfully",
        });
    } catch (error) {
      return res
        .status(500)
        .json({ data: [], message: "Error adding news category" });
    }
  }

  static async updateNewsCategory(req, res) {
    try {
        if(!validNewsCategory(req.body)){
            return res.status(400).json({data: [], message: "Invalid news category data"});
        }
        const {id} = req.params;

        if(!id || isNaN(parseInt(id))){
            return res.status(400).json({data: [], message: "Invalid news category id"});
        }
        const imageUrl = req.fileUrl || "";
        const {category} = req.body;

        //check if category exists
        const existingCategory = await db.select().from(newsCategory).where(eq(newsCategory.id, parseInt(id)));
        if(existingCategory.length === 0){
            return res.status(404).json({data: [], message: "News category not found"});
        }

        await db.update(newsCategory).set({category, image: imageUrl}).where(eq(newsCategory.id, parseInt(id)));

        //fetch the updated category to return to client
        const updatedCategory = await db.select().from(newsCategory).where(eq(newsCategory.id, parseInt(id)));
        if(updatedCategory.length === 0){
            return res.status(404).json({data: [], message: "News category not found after update"});
        }

        return res.status(200).json({data: validNewsCategoryToClient(updatedCategory), message: "News category updated successfully"});

    } catch (error) {
        return res.status(500).json({ data: [], message: "Error updating news category" });
    }
  }

  static async deleteNewsCategory(req, res) {
    try {
        if(!req.params.id || isNaN(parseInt(req.params.id))){
            return res.status(400).json({data: [], message: "Invalid news category id"});
        }
        const {id} = req.params;

        //check if category exists
        const existingCategory = await db.select().from(newsCategory).where(eq(newsCategory.id, parseInt(id)));
        if(existingCategory.length === 0){
            return res.status(404).json({data: [], message: "News category not found"});
        }

        await db.update(newsCategory).set({isDeleted: true}).where(eq(newsCategory.id, parseInt(id)));

        return res.status(200).json({data: [], message: "News category deleted successfully"});
    } catch (error) {
        return res.status(500).json({ data: [], message: "Error deleting news category" });
    }
  }

  static async getNews(req, res) {
    return res.status(200).json({data: [], message: "Get news endpoint"});
  }

  static async addNews(req, res) {
    try {
      if(!validNews(req.body)){
          return res.status(400).json({data: [], message: "Invalid news data"});
      }

      const image = req.fileUrl
      if(!image){
          return res.status(400).json({data: [], message: "News image is required"});
      }

      const {slug, title, excerpt, content, category, author, date, readTime, featured} = req.body;

      await db.insert(newsTable).values({slug, title, excerpt, content, image, blur_image:image , category, author, date: new Date(date), readTime, featured: featured === "true"});

      //its the last entry, fetch and return it
      const insertedNews = await db.select().from(newsTable).orderBy(desc(newsTable.created_at)).limit(1);
      if(insertedNews.length === 0){
          return res.status(404).json({data: [], message: "News not found after insertion"});
      }

       res.status(201).json({data: validNewsToClient(insertedNews), message: "News added successfully"});
      
      //generate blur

      const blur = await generateBlurImage(image);
      if(blur){
        await db.update(newsTable).set({blur_image: blur}).where(eq(newsTable.id, insertedNews[0].id));
      }


    } catch (error) {
      console.error("Error adding news:", error);
      return res.status(500).json({ data: [], message: "Error adding news" });
    }
  }

  static async updateNews(req, res) {}

  static async deleteNews(req, res) {}
}

module.exports = NewsController;
