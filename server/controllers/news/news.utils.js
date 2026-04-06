
const validNewsCategory= (news)=>{
    return news && news.category && typeof news.category === 'string' && news.category.trim() !== '';
}

const validNewsCategoryToClient = (news) => {
    return news.map((item) => {
        return {
            id: item.id,
            category: item.category,
            image: item.image,
        }
    })
}

// const newsTable = mysqlTable("news", {
//     id: int("id").primaryKey().autoincrement(),
//     slug: varchar("slug", { length: 255 }).notNull(),
//     title: varchar("title", { length: 255 }).notNull(),
//     excerpt: text("excerpt").notNull(),
//     content: longtext("content").notNull(),
//     image: varchar("image", { length: 255 }).notNull(),
//     blur_image: varchar("blur_image", { length: 255 }).notNull(),
//     category: int("category_id").notNull(),
//     author: varchar("author", { length: 255 }).notNull(),
//     date: date("date").notNull(),
//     readTime: int("read_time").notNull(),
//     featured: boolean("featured").default(false),
//     isDeleted: boolean("is_deleted").default(false),
//     created_at: timestamp("created_at").defaultNow(),
//     modified_at: timestamp("modified_at").defaultNow().onUpdateNow(),
// })

const validNewsToClient = (news) => {
    return news.map((item) => {
        return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            image: item.image,
            blur_image: item.blur_image,
            category: item.category,
            author: item.author,
            date: item.date,
            readTime: item.readTime,
            featured: item.featured,
        }
    })
}

const singleNewsToClient = (item) => {
    return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        image: item.image,
        blur_image: item.blur_image,
        category: item.category,
        author: item.author,
        date: item.date,
        readTime: item.readTime,
        featured: item.featured,
    }
}   


const validNews = (news) => {
    return news.slug && news.title && news.excerpt && news.content && news.category && news.author && 
    news.date && news.readTime && news.featured
}




module.exports = {
    validNewsCategory,
    validNewsCategoryToClient,
    validNews,
    validNewsToClient,
    singleNewsToClient
}