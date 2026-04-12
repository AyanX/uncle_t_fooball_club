
const validNewsCategory= (news)=>{
    return news && news.category
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

const normalizeDate = (input) => {
  if (!input) return null;

  // If it's already a Date object
  if (input instanceof Date) {
    return input.toISOString().split("T")[0];
  }

  // If it's a string
  if (typeof input === "string") {
    // Case 1: already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return input;
    }

    //  ISO string with time
    if (input.includes("T")) {
      return input.split("T")[0];
    }
  }

  // Fallback (handles weird formats)// just break here..
  const parsed = new Date(input);
  if (!isNaN(parsed)) {
    return parsed.toISOString().split("T")[0];
  }

  throw new Error("Invalid date format");
};

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
    return news.slug && news.title && news.excerpt &&
     news.content && news.category && news.author && 
    news.date && news.readTime
}

const normalizeBoolean = (value) => {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  return false;
};


module.exports = {
    validNewsCategory,
    validNewsCategoryToClient,
    validNews,
    validNewsToClient,
    singleNewsToClient, normalizeDate, normalizeBoolean
}