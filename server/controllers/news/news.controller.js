const { eq, desc } = require("drizzle-orm");
const { db, newsCategory ,newsTable} = require("../tables");
const {
  validNewsCategoryToClient,
  validNewsCategory,
  validNewsToClient,
  validNews,
  singleNewsToClient,
} = require("./news.utils");

const {generateBlurImage}= require("ayan-pkg")

//TODO  when a cate name is changed, news update
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
          .status(200)
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
          data: {id: newCategory[0].id, category: newCategory[0].category, image: newCategory[0].image},
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
        const imageUrl = req.fileUrl || req.body.image || "";
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

        return res.status(200).json({data: {id: updatedCategory[0].id, category: updatedCategory[0].category, image: updatedCategory[0].image}, message: "News category updated successfully"});

    } catch (error) {
  
        return res.status(500).json({ data: [], message: "Error updating news category" });
    }
  }

  static async getNewsBySlug(req, res) {
    try {
      const { slug } = req.params;
      const news = await db
        .select()
        .from(newsTable)
        .where(eq(newsTable.slug, slug))
        .limit(1);
      if (news.length === 0) {
        return res.status(404).json({ data: [], message: "News not found" });
      }
    

      return res.status(200).json({ data: {id: news[0].id, slug: news[0].slug,
title: news[0].title,
excerpt: news[0].excerpt,
content: news[0].content,
image: news[0].image,
blur_image: news[0].blur_image,
category: news[0].category,
author: news[0].author,
date: news[0].date,
readTime: news[0].readTime,
featured: news[0].featured === 1 ? true : false


       }, message: "News fetched successfully" });
    } catch (error) {
      return res.status(500).json({ data: [], message: "Error fetching news by slug" });
    }
  }

  static async addFeatured(req, res) {
    try {
      if(!req.params.id || isNaN(parseInt(req.params.id))){
          return res.status(400).json({data: [], message: "Invalid news id"});
      }
      const {id} = req.params;
      //check if news exists
      const existingNews = await db.select().from(newsTable).where(eq(newsTable.id, parseInt(id)));
      if(existingNews.length === 0){
          return res.status(404).json({data: [], message: "News not found"});
      }

      await db.update(newsTable).set({featured: 1}).where(eq(newsTable.id, parseInt(id)));
      existingNews[0].featured = 1;

      return res.status(200).json({data: singleNewsToClient(existingNews[0]), message: "News marked as featured successfully"});
    } catch (error) {
      return res.status(500).json({ data: [], message: "Error adding featured news" });
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
    try {
      const news = await db
        .select()
        .from(newsTable)
        .where(eq(newsTable.isDeleted, false))
        .orderBy(desc(newsTable.created_at));
      if (news.length === 0) {
        return res.status(404).json({ data: [], message: "No news found" });
      }

      return res
        .status(200)
        .json({ data: validNewsToClient(news), message: "News fetched successfully" });
    } catch (error) {
      console.error("Error fetching news:", error);
      return res.status(500).json({ data: [], message: "Error fetching news" });
    }
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

      req.body.featured = req.body.featured === true ? 1 : 0;

      const {slug, title, excerpt, content, category, author, date, readTime, featured} = req.body;



      await db.insert(newsTable).values({slug, title, excerpt, content, image, blur_image:image , category, author, date: new Date(date), readTime, featured: featured === "true"});

      //its the last entry, fetch and return it
      const insertedNews = await db.select().from(newsTable).orderBy(desc(newsTable.created_at)).limit(1);
      if(insertedNews.length === 0){
          return res.status(404).json({data: [], message: "News not found after insertion"});
      }

       res.status(201).json({data: singleNewsToClient(insertedNews[0]), message: "News added successfully"});
      
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

  static async updateNews(req, res) {
    try {
      if(!validNews(req.body)){
          return res.status(400).json({data: [], message: "Invalid news data"});
      }

      const {id} = req.params;
      if(!id || isNaN(parseInt(id))){
          return res.status(400).json({data: [], message: "Invalid news id"});
      }

      const existingNews = await db.select().from(newsTable).where(eq(newsTable.id, parseInt(id)));
      if(existingNews.length === 0){
          return res.status(404).json({data: [], message: "News not found"});
      }

      const image = req.fileUrl || existingNews[0].image;

      const {slug, title, excerpt, content, category, author, date, readTime, featured} = req.body;

      await db.update(newsTable).set({
        slug,
        title,
        excerpt,
        content,
        image,
        blur_image: image,
        category,
        author,
        date,
        readTime,
        featured:featured === true ? 1 : 0,
       }).where(eq(newsTable.id, parseInt(id)));

       //return req.body  news 

      res.status(200).json({data: {id: parseInt(id), slug, title, excerpt, content, image, blur_image: image, category, author, date, readTime, featured:featured === true ? 1 : 0}, message: "News updated successfully"});

      if(!req.fileUrl)return

      //generate blur in background
      const blur = await generateBlurImage(image);
      if(blur){
        await db.update(newsTable).set({blur_image: blur}).where(eq(newsTable.id, parseInt(id)));
      }

      return

    } catch (error) {
      return res.status(500).json({ data: [], message: "Error updating news" });
    }
  }

  static async deleteNews(req, res) {
      try {
    if(!req.params.id || isNaN(parseInt(req.params.id))){
        return res.status(400).json({data: [], message: "Invalid news id"});
    }
    const {id} = req.params;

    //check if news exists
    const existingNews = await db.select().from(newsTable).where(eq(newsTable.id, parseInt(id)));
    if(existingNews.length === 0){
        return res.status(404).json({data: [], message: "News not found"});
    }

    await db.update(newsTable).set({isDeleted: true}).where(eq(newsTable.id, parseInt(id)));

    return res.status(200).json({data: [], message: "News deleted successfully"});
  } catch (error) {
    return res.status(500).json({ data: [], message: "Error deleting news" });
  }
  }

}

module.exports = NewsController;
